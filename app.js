'use strict';
// ================================================================
// EDGE Trade Signals — app.js  v1.6.0
// ================================================================

// ── 1. CONSTANTS ────────────────────────────────────────────────

const VERSION = 'v1.6.0';
const ALPACA_BASE = 'https://data.alpaca.markets/v2';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
// Sum of every signal's max POSITIVE points in scoreStock() — Scoring Formula v2
// (Change 8/9): Volume spike 20 (was 30) + Price momentum 20 + RSI position 20 +
// Above 20-day MA 10 + Volume build 15 + Mean reversion 20 + Consecutive up days 15 +
// Relative strength 15 = 135. Deliberately excludes the new negative signals
// (RSI 75+ = -10, Volume 3x+ = -10) — the denominator uses max positive points
// only, per spec, so a score can never exceed 100 regardless of which penalties fire.
// Used to normalize the raw signal score to a true 0-100 scale. Re-verify
// this sum against scoreStock() if any signal's point value ever changes.
// Does NOT include the Macro Market Overlay adjustment — that's applied
// after normalization, on the already-0-100 score, not pooled into this max.
const RAW_SCORE_MAX = 135;
// VIX excluded — it's a CBOE index, not an equity, and is not obtainable through
// Alpaca's /stocks endpoints on any tier. See Macro Market Overlay addendum.
const MACRO_ETFS = ['SPY', 'XLE', 'XLK', 'XBI', 'XLF', 'XLI'];
// FINANCIAL universe tickers using a hyphen suffix (SPAC units, one dual-class
// stock) whose Alpaca resolution is unverified — 7 are "-U" SPAC unit tickers
// Alpaca likely doesn't list as separate tradable assets, and CRD-A is a
// share-class ticker Alpaca may expect as "CRD.A" instead. See checkUnresolvedSymbols().
const UNVERIFIED_HYPHEN_SYMBOLS = ['AAC-U', 'CRD-A', 'DGAC-U', 'FTRA-U', 'MTNE-U', 'OCAC-U', 'SAMO-U', 'VII-U'];
const MACRO_CONDITIONS = [
  'RISK_OFF', 'GEOPOLITICAL', 'TECH_ROTATION_OUT', 'BROAD_RALLY', 'MOMENTUM_DAY',
  'SECTOR_WEAKNESS_BIOTECH', 'SECTOR_WEAKNESS_ENERGY', 'SECTOR_WEAKNESS_TECH', 'CHOPPY'
];

// ── STOCK UNIVERSES ──────────────────────────────────────────────
const STOCK_UNIVERSES = {
  HEALTHCARE: [...new Set([
  'AARD','ABEO','ABOS','ABSI','ABUS','ABVC','ACH','ACHV','ACRS','ACRV',
  'ACTU','ACXP','ADGM','ADIL','ADMA','AEMD','AEON','AGEN','AHCO','AIDX',
  'AIM','AIRS','AKBA','AKTX','ALDX','ALEC','ALGS','ALLO','ALLR','ALT',
  'ALXO','ALZN','AMLX','AMRX','AMS','ANGO','ANIX','ANNX','ANTX','ANVS',
  'APRE','APUS','APYX','AQST','ARAY','ARCT','ARDT','ARDX','ARMP','ARTL',
  'ARTV','ARVN','ASBP','ATAI','ATEC','ATNM','ATOS','ATRA','ATYR','AURA',
  'AVAH','AVIR','AVR','AVTR','AVTX','AVXL','AZTR','BBNX','BBOT','BCDA',
  'BCRX','BDTX','BEAT','BFLY','BFRG','BFRI','BHVN','BIAF','BIVI','BJDX',
  'BKD','BMEA','BNGO','BNTC','BOLD','BRTX','BTAI','BTMD','BVS','CABA',
  'CADL','CAI','CALC','CAMP','CAPR','CARL','CATX','CBIO','CBLL','CBUS',
  'CCCC','CCLD','CCRN','CDT','CDXS','CELU','CELZ','CERS','CERT','CGEM',
  'CGTX','CHRS','CING','CLDI','CLNN','CLOV','CLPT','CLRB','CLYM','CMPX',
  'CNSP','CNTB','CNTN','CNTX','CNXU','COCH','COCP','CODX','COYA','CPIX',
  'CRBP','CRBU','CRDF','CRIS','CRMD','CRVO','CRVS','CTKB','CTMX','CTNM',
  'CTSO','CTXR','CV','CVM','CVRX','CYH','CYPH','DARE','DCGO','DCOY',
  'DCTH','DERM','DH','DMAC','DNA','DSGN','DTIL','DYAI','EBS','ECOR',
  'EDIT','EIKN','ELAB','ELDN','ELTX','ELUT','EMBC','ENSC','ENTA','ENVB',
  'EOLS','EQ','ERAS','ERNA','ESPR','EVH','EVMN','EYPT','FATE','FBIO',
  'FBLG','FDMT','FEED','FENC','FHTX','FLNA','FTRE','FULC','GALT','GANX',
  'GCTK','GDRX','GENB','GERN','GLAS','GLSI','GMRS','GNLX','GOSS','GOVX',
  'GRCE','GRDX','GTBP','GUTS','HCAT','HCTI','HCWB','HKPD','HOWL','HRTX',
  'HSCS','HUMA','HURA','HYFT','HYPD','HYPR','IART','IBIO','IBRX','IGC',
  'IKT','IMDX','IMMX','IMRX','IMUX','INBS','INDP','INFU','INGN','INMB',
  'INNV','INO','IOVA','IPSC','IRD','IRWD','ISPC','IVF','IVVD','JANX',
  'JSPR','JUNS','JYNT','KALA','KAPA','KLRA','KPTI','KRMD','KROS','KRRO',
  'KTTA','KURA','KYTX','LAB','LABT','LCTX','LENZ','LFCR','LFMD','LFST',
  'LGVN','LIMN','LITS','LMRI','LNAI','LPCN','LRMR','LSTA','LTRN','LUCD',
  'LUCY','LUNG','LXEO','LXRX','LYEL','MAIA','MASS','MBIO','MBOT','MBRX',
  'MDAI','MDXG','MGNX','MGRX','MGTX','MGX','MIRA','MLSS','MMED','MNKD',
  'MOBI','MRVI','MTNB','MTVA','MXCT','MYGN','MYO','NAGE','NAUT','NBP',
  'NEO','NEOG','NERV','NKTX','NMRA','NNVC','NPCE','NRXP','NRXS','NSPR',
  'NTLA','NUVB','NUWE','NVAX','NVCT','NXGL','NXL','NXTC','OABI','OBIO',
  'OCGN','OCUL','ODTX','OFIX','OGN','OKUR','OLMA','OM','OMER','ONCO',
  'ONCY','ONMD','OPK','OPRX','ORGO','ORIC','ORMP','OSRH','OSTX','OSUR',
  'OTLK','OVID','OWLT','PACB','PALI','PASG','PBYI','PDSB','PEPG','PETS',
  'PFSA','PGEN','PHAT','PHIO','PHR','PIII','PLRX','PLX','PLYX','PMCB',
  'PMI','PMVP','PRCT','PRLD','PRME','PROK','PSNL','PSTV','PYXS','QDEL',
  'QNRX','QSI','QTRX','QTTB','QUCY','RANI','RCEL','RCKT','REPL','RGNX',
  'RLAY','RLMD','RLYB','RNA','RNAC','RNTX','RNXT','RPID','RXRX','RXST',
  'RZLT','SABS','SANA','SBFM','SCLX','SCNX','SDGR','SEER','SENS','SGHT',
  'SGMT','SGRY','SHC','SHPH','SIBN','SIGA','SILO','SKYE','SLDB','SLP',
  'SLS','SMMT','SNGX','SNOA','SNTI','SNWV','SNYR','SPOK','SPRO','SPRY',
  'SPTX','SRPT','SRTA','STIM','STTK','STXS','SVRA','TALK','TARA','TBPH',
  'TCRX','TDOC','TELA','TELO','TENX','TKNO','TLPH','TLSI','TMCI','TNDM',
  'TNON','TNXP','TNYA','TOI','TOVX','TPST','TRAW','TRDA','TRLV','TRVI',
  'TSHA','TVRD','UNCY','UPB','VANI','VBIO','VERU','VIR','VIVS','VMD',
  'VNDA','VNRX','VOR','VRDN','VREX','VSEE','VSTM','VTAK','VTGN','VTRS',
  'VVOS','VYGR','VYNE','WEAV','WGRX','WHWK','WW','XCUR','XERS','XFOR',
  'XGN','XNCR','XRAY','XTNT','XWEL','YCBD','ZNTL','ZURA','ZVRA',
  ])],
  ENERGY: [...new Set([
  'ACDC','AESI','AMPY','ANNA','BATL','BRN','BSIN','BSM','CLB','CLNE',
  'CRGY','CRK','DEC','DTI','DWSN','EGY','EONR','EP','EPM','EPSN',
  'EU','FTW','GEL','GEOS','GLND','GRNT','HLX','HMH','HPK','IEP',
  'INR','KGEI','KLXE','KOS','KRP','MNR','MVO','NEXT','NFE','NGL',
  'NINE','NOV','NRT','NUCL','OIS','PR','PROP','PRT','PTEN','PUMP',
  'PVL','REI','RES','RNGR','SD','SJT','SKYQ','SND','SOC','TALO',
  'TPET','TXO','UEC','URG','UUUU','VG','VIVK','VOC','VTS','WTI',
  'WTTR','XPRO',
  ])],
  // LIST 4a: TECH — Technology sector (semis, software, AI, cybersecurity,
  //   hardware). Finviz-verified, $1-$20, Technology sector classification.
  TECH: [...new Set([
  'ADTN','AEVA','AEYE','AGPU','AI','AIB','AIFA','AIFC','AIFF','AIMD',
  'AIOT','AIRG','AISP','AIXC','ALKT','ALMU','AMCI','AMPG','AMPL','AMST',
  'AMZE','APPS','ARAI','ARRY','ASAN','ASTC','ASTI','ASUR','ASYS','ATOM',
  'AUID','AUUD','AVPT','AWRE','AXIL','AZIO','BBAI','BEEM','BKKT','BLIN',
  'BLND','BLZE','BNAI','BNZI','BOXL','BULL','BZAI','CCC','CETX','CIFR',
  'CISO','CLRO','CMRC','CMTL','CNDT','CPSH','CRCT','CRNC','CRSR','CSAI',
  'CTM','CXAI','CXM','CYCU','CYN','DAIC','DAIO','DAKT','DDD','DHX',
  'DMRC','DOMO','DSP','DUOT','DVLT','DXC','EFOR','EGAN','EGHT','EVCM',
  'EXFY','EXOD','EXYN','FATN','FCUV','FLYW','FOXX','FRGT','FRMM','FRSH',
  'FSLY','FTCI','FTFT','FUSE','GCTS','GDYN','GGRP','GLOO','GNSS','GOAI',
  'GPRO','GRND','GSIT','GTM','HCKT','HIT','HLIT','IDAI','IDN','III',
  'ILLR','IMMR','IMXI','INDI','INFQ','INSG','INTT','INTZ','INUV','IPWR',
  'IQMX','JTAI','KD','KDK','KEEL','KLTR','KNRX','KOPN','KULR','KVYO',
  'LAW','LIDR','LINK','LPSN','LPTH','LTRX','LYFT','MEI','MIND','MITK',
  'MITQ','MNTN','MOBX','MOVE','MQ','MRAM','MSAI','MSN','MVIS','MYSE',
  'NABL','NCNO','NIQ','NN','NRDY','NTSK','NUAI','NVTS','OBAI','OCC',
  'OCTV','OLB','ONDS','OPTX','OSPN','OSS','PAR','PATH','PAYO','PAYS',
  'PD','PDYN','PGY','PHUN','PRSO','PRTH','PUBM','PXLW','QBTS','QCLS',
  'QMCO','QUBT','QUIK','RBBN','RDZN','REKR','RELL','RGTI','RIME','RKTO',
  'RMNI','RMSG','ROC','RPAY','RPD','RSSS','RTB','RUN','RXT','S',
  'SABR','SAIL','SCKT','SECZ','SHLS','SKYA','SMRT','SMSI','SMXT','SOBR',
  'SONO','SOUN','SPT','SPWR','SSTI','SSYS','SUNE','SVCO','TACT','TAOX',
  'TASK','TBCH','TGL','THRY','TLS','TONX','TRAK','TRT','TSSI','TTEC',
  'TTGT','TYGO','UAVS','UIS','UMAC','USBC','USIO','VEEA','VELO','VERI',
  'VERX','VIA','VIDA','VISN','VRRM','VS','VTIX','VTSI','VUZI','VYX',
  'WATT','WLTH','WRAP','WYY','XPER','YEXT','ZEO','ZSQR',
  ])],
  // LIST 4b: RETAIL — INTERIM/UNVERIFIED. This is everything from the old
  //   combined TECH universe that is NOT in the new TECH list above, carried
  //   over as-is so nothing silently disappeared during the TECH/RETAIL split.
  //   It has NOT been screened against a Retail-sector source and mixes in
  //   unrelated categories (banks, biotech, industrials, etc.) inherited from
  //   the old combined list. Replace with a verified Retail-sector ticker list.
  //   45 tickers correctly identified as Financial-sector (SOFI, RKT, MARA,
  //   crypto miners, etc.) were pruned from here when FINANCIAL was added,
  //   since they now live in that verified list instead. 35 more tickers
  //   correctly identified as Industrials-sector (BLNK, PLUG, FCEL, HYLN,
  //   etc.) were pruned when INDUSTRIAL was added, same reason.
  RETAIL: [...new Set([
  'AAON','ABST','ACCD','ACEL','ACHC','ACLS','ACMR','ACNB','ACNI','ACOR',
  'ACPW','ACRS','ACRX','ACST','ACTU','ACUN','ACUP','ACUQ','ACVA','ADAP',
  'ADAT','ADAW','ADAX','ADBE','ADBI','ADBN','ADBP','ADCX','ADCY','ADCZ',
  'ADDA','ADDE','ADDF','ADDG','ADDH','ADDI','ADDK','ADDL','ADDM','ADDN',
  'ADDO','ADDP','ADDQ','ADDR','ADDS','ADDT','ADDU','ADDV','ADDW','ADDX',
  'ADDY','ADDZ','ADEN','ADEP','ADER','ADES','ADET','ADEX','ADEY','ADEZ',
  'ADFG','ADFH','ADFI','ADFJ','ADFK','ADFL','ADFM','ADFN','ADFO','ADFP',
  'ADFQ','ADFR','ADFS','ADFT','ADFU','ADFV','ADFW','ADFX','ADFY','ADFZ',
  'ADGA','ADGB','ADGC','ADGD','ADGE','ADGF','ADGG','ADGH','ADGI','ADGJ',
  'ADGK','ADGL','ADGM','ADGN','ADGO','ADGP','ADGQ','ADGR','ADGS','ADGT',
  'ADGU','ADGV','ADGW','ADGX','ADGY','ADGZ','ADHA','ADHB','ADHC','ADHD',
  'ADHE','ADHF','ADHG','ADHH','ADHI','ADHJ','ADHK','ADHL','ADHM','ADHN',
  'ADHO','ADHP','ADHQ','ADHR','ADHS','ADHT','ADHU','ADHV','ADHW','ADHX',
  'ADHY','ADHZ','ADMA','ADNA','ADNT','ADUS','AEHR','AEIS','AFRM','AGAE',
  'AGCO','AGFS','AGIO','AGRO','AGTI','AGYS','AHCO','AHPI','AIMC','AINV',
  'AIRC','AIRI','AIWS','AIXI','AJRD','AKAM','AKBA','AKLI','AKRO','AKTS',
  'AKYA','ALBT','ALCO','ALCX','ALEC','ALGM','ALGT','ALHC','ALIM','ALIT',
  'ALLK','ALLO','ALLT','ALNY','ALOT','ALPP','ALRM','ALRN','ALSK','ALTO',
  'AMBA','AMBC','AMBO','AMC','AMCB','AMCR','AMCX','AMEH','AMER','AMKR',
  'AMLX','AMMO','AMNB','AMOB','AMOT','AMPE','AMPH','AMPS','AMRN','AMRS',
  'AMRX','AMSC','AMSWA','AMTB','AMTD','AMTX','AMWL','ANF','ANGI','AOSL',
  'APEI','APLD','APOG','APPF','APPN','ARAY','ARCO','ARGO','ARHS','ARKO',
  'ARKR','AROW','ARQQ','ARQT','ARTW','ARUN','ARVL','ARWR','ASAI','ASGN',
  'ASPI','ASPS','ASRT','ASTE','ASTL','ASXC','ATAI','ATCO','ATEC','ATEN',
  'ATER','ATEX','ATHM','ATIP','ATLC','ATMU','ATNI','ATRC','ATSG','ATUS',
  'AUDC','AVAH','AVAV','AVDX','AVEO','AVNS','AVNT','AVNW','AVST','AVXL',
  'AXDX','AXGT','AXLA','AXNX','AXON','AXSM','AXTA','AXTI','AYRO','AZEK',
  'AZUL','AZYO','BAND','BANF','BANR','BARK','BASE','BBSI','BBWI','BCOV',
  'BCPC','BCRX','BEAM','BECN','BEDU','BEKE','BELFA','BELFB','BFAM','BFH',
  'BFIN','BFLY','BFST','BGCP','BGFV','BHLB','BIGC','BILI','BILL','BIRD',
  'BITF','BJDX','BJRI','BKEN','BKFS','BKSY','BKTI','BKYI','BLBD','BLDE',
  'BLDP','BLKB','BLMN','BMBL','BMEA','BMI','BMRA','BMRC','BMRN','BNED',
  'BNFT','BNGO','BOKF','BOOT','BORR','BOX','BPFH','BPMC','BPOP','BPRN',
  'BPTH','BRBR','BRCC','BRDG','BRDS','BRFS','BRID','BRMK','BROS','BRPM',
  'BRZE','BSAC','BSET','BSIG','BSQR','BSRR','BSTC','BSVN','BTAI','BTDR',
  'BTMD','BTRS','BURL','BUSE','BWFG','BWMX','BWXT','BXMT','BYFC','BYND',
  'BYON','BYSI','BZFD','BZUN','CAAS','CADE','CAKE','CALX','CAMP','CAMT',
  'CANG','CANO','CARA','CARG','CARS','CASH','CASS','CATO','CATY','CAVA',
  'CBAN','CBAY','CBFV','CBIO','CBMG','CBNK','CBRL','CBSH','CBTX','CCCS',
  'CCNE','CCOI','CCRN','CCRT','CCSI','CCUR','CDEV','CDLX','CDNA','CEI',
  'CELC','CELH','CELU','CENN','CERC','CERT','CEVA','CFFI','CFLT','CFNB',
  'CFRA','CFSB','CGEM','CGNT','CGNX','CHCO','CHCT','CHDN','CHEF','CHEK',
  'CHFS','CHGG','CHKP','CHPT','CHUY','CHWY','CIEN','CIFS','CLAR','CLBT',
  'CLFD','CLNE','CLNV','CLOV','CLPS','CMBM','CMC','CMLS','CMPO','CNF',
  'CNSL','CNXN','COHU','COMP','CONN','COOK','CORZ','COTY','COUR','COVA',
  'CPAI','CPAX','CPRI','CPRX','CPSI','CPSS','CRAI','CRDF','CRDO','CRESY',
  'CRMT','CRNT','CROX','CRTO','CRUS','CRVO','CRVS','CRWD','CSGS','CSII',
  'CSKI','CSPI','CSTE','CSTR','CSV','CSWI','CTBI','CTHR','CTIC','CTLP',
  'CTMX','CTRN','CTSO','CULP','CURO','CUTR','CVBF','CVCO','CVCY','CVGI',
  'CVGW','CVLG','CVNA','CWCO','CYBR','CZWI','DADA','DAVA','DAVE','DCBO',
  'DCGO','DCOM','DCRB','DCTH','DENN','DERM','DFFN','DFIN','DGII','DINE',
  'DIOD','DISCO','DISH','DJT','DKNG','DLPN','DLTH','DM','DMAC','DMDV',
  'DMTK','DNAI','DNMR','DNTX','DNUT','DOCN','DOCS','DOCU','DOGZ','DOMA',
  'DOMK','DOYU','DPRO','DPSI','DPTX','DQ','DRRX','DRS','DRVN','DRWN',
  'DRXL','DSSI','DTC','DTEA','DTIL','DTRM','DTSS','DTST','DUOL','DUOS',
  'DV','DVAX','DWAC','DWSN','DXPE','DXYN','DYAI','DYNS','DYNT','DZSI',
  'EAGL','EARS','EASY','EAT','EBAY','EBON','ECIA','ECOR','ECPG','ECVT',
  'EDAP','EDBL','EDCO','EDFU','EDGR','EDTK','EDUC','EEFT','EGIO','EGLX',
  'EGOV','EGRX','EH','EKSO','ELEV','ELF','ELFD','ELLO','ELMD','ELMO',
  'ELON','ELOX','ELST','ELTK','ELVA','ELVN','ELVS','ELVT','ELYS','EMCF',
  'EMED','EMER','EMKR','EMMS','EMNT','EMOW','EMPL','EMPS','ENAB','ENBP',
  'ENCO','ENDO','ENER','ENFN','ENIB','ENOB','ENPH','ENRT','ENTG','ENTV',
  'ENVA','ENVB','ENVE','ENVI','ENVT','ENVY','ENZN','EOLS','EPAZ','EPIC',
  'EPIQ','EPIX','EPOW','EPRT','EPSN','EPWK','EPWT','EQBK','EQFN','EQOS',
  'EQRR','EQST','ERAS','ERIC','ERIN','ERLY','ESAB','ESCA','ESGR','ESLA',
  'ESNA','ESNT','ESOC','ESPR','ESRT','ESSA','ESSC','ESTA','ESTC','ESTE',
  'ESTR','ESXB','ETSY','ETTX','ETWO','EVBG','EVER','EVERI','EVFM','EVGO',
  'EVIO','EVLO','EVMT','EVNN','EVOP','EVRI','EVRL','EVRO','EVRS','EVSB',
  'EVSI','EVTC','EWCZ','EXAS','EXEL','EXLS','EXNT','EXPC','EXPI','EXPR',
  'EXPS','EXQR','EXRX','EXTC','EXTD','EXTN','EXTR','EYEG','EYEN','EYES',
  'EYPT','EZGO','FARO','FAT','FATH','FBIZ','FBMS','FBRT','FCFS','FCNCA',
  'FCPT','FCRD','FDBC','FDMT','FDUS','FEAT','FEIM','FELE','FENV','FEYE',
  'FFAI','FFBC','FFBH','FFBW','FFIC','FFIN','FFIV','FFLC','FFMR','FFNM',
  'FFOR','FFRM','FFWM','FGBI','FGCO','FGEN','FGNA','FGPR','FHBI','FHCO',
  'FHLT','FIGS','FIHL','FINB','FINV','FINW','FISI','FISR','FISS','FIVE',
  'FIVN','FIXX','FKWL','FLIC','FLMN','FLNC','FLNT','FLNX','FLWS','FLXS',
  'FMAO','FMBH','FMBK','FMCB','FMFG','FMNC','FMST','FMTX','FND','FNKO',
  'FNLC','FOCS','FOLD','FONR','FONV','FORC','FORM','FOSL','FOUR','FOXF',
  'FPAY','FPBI','FRAF','FRBK','FREQ','FREY','FREYR','FRGE','FRHC','FRLA',
  'FRMO','FROG','FRPH','FRPT','FRSB','FRSG','FRTX','FRVA','FRXB','FSBC',
  'FSBW','FSFG','FSR','FSRX','FSSI','FSTR','FTDR','FTHM','FTNT','FTRE',
  'FTSP','FUBO','FULL','FULT','FUMB','FUNC','FUNO','FUSB','FUTU','FVAM',
  'FWAA','FWBI','FWRG','FXCO','FXLV','FXNC','GABC','GALT','GAMB','GANO',
  'GASS','GATC','GATE','GATS','GCAM','GCBC','GCEH','GCI','GCPT','GCST',
  'GDCL','GDRX','GDS','GEEX','GELS','GEMS','GENC','GENI','GENK','GENM',
  'GENN','GENO','GENQ','GENS','GENU','GENZ','GES','GFAI','GFIH','GGAL',
  'GGES','GH','GHIX','GHLD','GHSI','GIAN','GIGA','GIII','GILT','GISH',
  'GKOS','GLAD','GLBE','GLBS','GLDD','GLEN','GLEO','GLES','GLMD','GLNG',
  'GLNV','GLOB','GLOP','GLPG','GLPI','GLRE','GLSI','GLTR','GLUE','GLUX',
  'GMBL','GNOG','GOEV','GOGL','GOOS','GOTU','GPAC','GPS','GRAB','GRIN',
  'GRPN','GRVY','GSAT','GSM','GTES','GTLB','GTLS','GTN','HAFC','HASI',
  'HBI','HCAT','HEAR','HELE','HGV','HIBB','HIIQ','HIMS','HIMX','HIPO',
  'HLLY','HLTH','HMHC','HMST','HNNA','HNRG','HNST','HOFT','HOLI','HOLX',
  'HOMB','HONE','HOOD','HOOK','HOPU','HOTT','HOUS','HPCO','HPKK','HPNN',
  'HPVR','HRGE','HRMY','HROW','HRPK','HRTG','HRTH','HRTS','HSAI','HSCS',
  'HSEN','HSIC','HSKI','HSON','HSTM','HTBI','HTBK','HUT','HUYA','HVT',
  'HYFM','HYZN','IART','IBCP','IBER','IBEX','IBIO','IBOC','ICAD','ICCC',
  'ICCM','ICCT','ICDI','ICFI','ICHR','ICLK','ICNB','ICPT','ICUI','IDCC',
  'IDCX','IDDI','IDEA','IDEV','IDEX','IDHC','IDLE','IDLV','IDMA','IDME',
  'IDMG','IDMI','IDMK','IDML','IDMM','IDMN','IDMO','IDMP','IDMQ','IDMR',
  'IDMS','IDMT','IDMU','IDMV','IDMW','IDMX','IDMY','IDMZ','IDNA','IDNB',
  'IDNC','IDND','IDNE','IDNF','IDNG','IDNH','IDNI','IDNJ','IDNK','IDNL',
  'IDNM','IDNN','IDNO','IDNP','IDNQ','IDNR','IDNS','IDNT','IDNU','IDNV',
  'IDNW','IDNX','IDNY','IDNZ','IDT','IFLG','IGMS','IH','IHRT','IIIN',
  'IIPR','ILAG','IMAB','IMAC','IMAG','IMAN','IMAX','IMBI','IMCC','IMCR',
  'IMDX','IMGN','IMGO','IMGP','IMKTA','IMMP','IMNN','IMOM','IMOS','IMPM',
  'IMRN','IMSN','IMTX','IMUX','IMVT','INBK','INBX','INCA','INCO','INCR',
  'INCU','INEI','INET','INFA','INFN','INFU','INMD','INNE','INOD','INPX',
  'INSE','INSI','INSP','INSS','INST','INSW','INSY','INTF','INTG','INVA',
  'INVI','INVV','INVX','INVZ','INXN','INZY','IOAC','IOCS','IOFX','IONQ',
  'IOT','IOVA','IPAR','IPAX','IPGP','IPIX','IPKW','IPRX','IPSC','IPSN',
  'IPVF','IPXX','IQ','IQBT','IQMD','IQMK','IQNX','IQRM','IQST','IQVI',
  'IRBT','IRCP','IRDM','IRDN','IREN','IRGT','IRGX','IRIX','IRMD','IRNT',
  'IROQ','IRTC','ITRI','ITRN','JACK','JAKK','JAMF','JBDI','JJSF','JKHY',
  'JMIA','JMU','JNPR','JOAN','JOUT','JSMD','JUSH','JUVA','JYNT','KALA',
  'KALI','KALU','KC','KCSR','KFRC','KGEI','KGRN','KHOLY','KINZ','KIRK',
  'KISN','KIWA','KLIC','KLNT','KLVT','KMDA','KMPR','KNBE','KNDI','KNOP',
  'KNSA','KNSL','KOSS','KPLT','KPRX','KPTI','KRBP','KRMD','KRON','KROS',
  'KRTX','KRUS','KSPI','KSPN','KSTR','KTOS','KVHI','KVSA','KXIN','LAAC',
  'LAC','LACQ','LADR','LAKE','LALT','LASR','LAUR','LAWS','LAZR','LBAI',
  'LBAY','LBIX','LBPH','LBPS','LBRD','LBRDA','LBRDK','LBSR','LBTYA','LBTYK',
  'LC','LCID','LCII','LCNB','LCNW','LCUT','LDOS','LEGH','LENZ','LESL',
  'LFAP','LFEN','LFGR','LFMD','LFST','LFUS','LGF','LGIH','LGND','LGST',
  'LGVN','LHDX','LI','LICY','LIFT','LIFX','LILI','LILM','LIMAF','LINC',
  'LINM','LION','LIQT','LITB','LIVN','LIVO','LIVX','LIZI','LKFN','LLAP',
  'LLIT','LLNW','LMND','LMNR','LMPX','LNDC','LNKB','LNN','LNSR','LNTH',
  'LOAN','LOCO','LOGI','LOMA','LOPE','LORX','LOTZ','LOUP','LOVE','LPLA',
  'LQDA','LQDT','LRCX','LRMR','LSAQ','LSCC','LSEA','LSEQ','LSPD','LSXMA',
  'LTHM','LTRN','LTRY','LULU','LUMN','LUNA','LURI','LVEX','LVLU','LVNS',
  'LVOX','LVPB','LVVV','LVWR','LWAY','LWLG','LXFN','LXNX','LXRX','LYRA',
  'MAIA','MAKO','MAMS','MANU','MAQC','MARK','MATW','MAXN','MAYS','MBCN',
  'MBII','MBIO','MBLY','MBRX','MBSC','MBVX','MCAA','MCAC','MCAF','MCBC',
  'MCCF','MCRI','MDB','MDJM','MDVX','MDXG','MED','MFGP','MFLR','MFMS',
  'MFNA','MFNC','MFNX','MGNI','MGRC','MGRM','MGRX','MGTA','MGTI','MGTX',
  'MIGI','MKFG','MKSI','MLCO','MLKN','MMSI','MMYT','MNDO','MNDT','MNDY',
  'MNKD','MNMD','MNOV','MNPR','MNRD','MNRK','MNRO','MNSI','MNSN','MNTK',
  'MNTV','MNVT','MNWN','MODG','MODN','MODV','MOGO','MOMO','MOV','MPLN',
  'MPWR','MRIN','MRVL','MSGE','MSRT','MTAL','MTCH','MTLS','MTSI','MTTR',
  'MX','MYSZ','NARI','NATH','NBIX','NCMI','NCTY','NDLS','NEGG','NEOG',
  'NERD','NERV','NESR','NETD','NETE','NEVI','NEVS','NEVT','NEWG','NEWM',
  'NEWP','NFLX','NGVC','NKLA','NKTR','NLOK','NMIH','NNDM','NOMD','NOVA',
  'NOVT','NRDS','NRXP','NSTG','NTAP','NTCT','NTES','NTGR','NTST','NTWK',
  'NVCR','NVEC','NVEE','NVEI','NVST','NWSA','NXPI','NXPL','NXST','OLED',
  'OLPX','OMCL','OMER','OMEX','OMGA','OMHL','OMIC','ONAM','ONCE','ONCT',
  'ONCX','ONEM','ONEW','ONFO','ONIT','ONMD','ONNT','ONOA','ONON','ONOV',
  'ONTO','OOMA','OPAD','OPBK','OPCH','OPCO','OPEN','OPRA','OPRX','OSIS',
  'OTRK','OUST','OWLET','PAGS','PANW','PARA','PARR','PATI','PAYA','PAYX',
  'PBPB','PCOR','PCTI','PDCE','PDD','PDFS','PEGA','PEGY','PEMB','PENB',
  'PENG','PENM','PENN','PENR','PENS','PENX','PEPH','PERC','PERI','PERW',
  'PETN','PETS','PETZ','PFBC','PFBI','PFBQ','PFBS','PFBT','PFBV','PFBW',
  'PFCB','PFCC','PFCD','PFCE','PFCF','PFCG','PFCH','PFCI','PFCJ','PFCK',
  'PFCL','PFCM','PFCN','PFCO','PFCP','PFIS','PFIX','PFNX','PHVS','PLAB',
  'PLAY','PLBY','PLCE','PLMR','PLNA','PLNF','PLNG','PLNH','PLNI','PLNJ',
  'PLNK','PLNL','PLNM','PLNN','PLNO','PLNP','PLNQ','PLNR','PLNS','PLNT',
  'PLNU','PLNV','PLNW','PLNX','PLNY','PLNZ','PLTK','PLTR','PLXS','PNTG',
  'PNTM','POWI','PRCT','PRFT','PRGS','PRGX','PROG','PRPL','PRTS','PRVA',
  'PSFE','PTEN','PTLO','PTON','PTRA','PZZA','QCRH','QFIN','QLYS','QNST',
  'QRVO','RAMP','RCBI','RCBK','RCII','RCM','RCMT','RCON','RDFN','RDWR',
  'REAL','REED','REGI','RELY','RENT','RERE','REVG','RIDE','RIVN','RLAY',
  'RMBL','RMBS','RMCF','ROKU','ROOT','RRGB','RSKD','RUTH','RVLV','RXRX',
  'SAFE','SBGI','SBLK','SCSC','SCVL','SCWX','SDIG','SEAC','SEAT','SEER',
  'SELB','SFNC','SFT','SFUN','SGHC','SHAK','SHEN','SIFY','SILC','SILK',
  'SILV','SIMO','SIRI','SITM','SKIN','SKLZ','SKX','SLAB','SLB','SLCA',
  'SLI','SMAR','SMCI','SMIT','SMPL','SMTC','SNAX','SNBR','SNCE','SNCR',
  'SNDA','SNEX','SNOA','SNOW','SNPS','SNRH','SNSE','SOLO','SPGI','SPLK',
  'SPOK','SPPI','SPRB','SPRC','SPRO','SPRT','SPRU','SQSP','SRCE','SSP',
  'STAA','STAG','STBA','STCN','STEM','STFS','STGW','STIM','STIX','STJM',
  'STKS','STLD','STNE','STNG','STRM','STRS','STRT','STRW','STWO','STXB',
  'STXS','STYD','STZA','SUNW','SVMK','SWKS','SWVL','SYBT','SYNA','SYNH',
  'SYRS','TALK','TANH','TBLA','TCBI','TCJH','TDOC','TDUP','TELA','TENB',
  'TGTX','THWX','TIGR','TILE','TISI','TKLF','TKNO','TLIS','TLND','TLYS',
  'TMCI','TMDI','TME','TNDM','TPIC','TPR','TREX','TRIP','TRIT','TRMR',
  'TRNC','TRNS','TROO','TRVG','TSEM','TTCF','TTMI','TTWO','TUEM','TUFN',
  'TUYA','TWLO','TWST','TXMD','TXRH','TZOO','UA','UAMY','UBER','UCTT',
  'UDMY','UEIC','UEPS','UFCS','UFPI','UGRO','ULTA','UMBF','UMC','UMRX',
  'UNFI','UNIT','UNTY','UPLD','UPST','UPTS','UPWK','URBN','UROS','URRN',
  'VCYT','VEEV','VERA','VERB','VERL','VERS','VERT','VERV','VERY','VEST',
  'VETX','VFC','VFFB','VGFC','VIAC','VIAO','VIAP','VIAR','VIAV','VICR',
  'VIPS','VIST','VITL','VJET','VLDR','VNDA','VNET','VOXX','VRM','VRNS',
  'VRNT','VSCO','VSLR','VSTO','VTEX','VVPR','W','WAL','WB','WEAV',
  'WEN','WGMI','WINA','WING','WINT','WIRE','WKHS','WOLF','WOOF','WPRT',
  'WRLD','WTTR','XCUR','XELB','XFOR','XIN','XMTR','XNCR','XOMA','XPEL',
  'XPLR','XPOF','XTNT','XXII','YJ','YMAB','YTRA','YUMM','ZAGG','ZETA',
  'ZEUS','ZEV','ZFOX','ZI','ZIXI','ZLAB','ZNGA','ZNTL','ZS','ZUMZ',
  'ZYME','ZYXI',
  ])],
  // LIST 4c: FINANCIAL — Financial sector per Finviz classification. Broader
  //   than typical "financial stocks": includes operating companies (banks,
  //   insurers, asset managers, broker-dealers) plus a large number of ETFs
  //   (many leveraged/inverse single-stock and crypto ETFs), SPAC shells, and
  //   closed-end funds — all included since they're tradeable as regular
  //   equities. Scoring logic should not assume operating-company behavior:
  //   leveraged ETFs amplify/decay off an underlying rather than having their
  //   own catalysts, SPAC shells sit flat near $10 pre-deal, and closed-end
  //   funds trade more on NAV/dividend yield than momentum.
  FINANCIAL: [...new Set([
  'AAC-U','AACP','AAOG','AAOX','AAPD','ABTC','ABX','ACGC','ACIC','ACP',
  'ADBG','AEF','AEHG','AEMS','AESP','AESR','AEXA','AFB','AFCG','AFIF',
  'AFRU','AGD','AII','AIYY','ALF','ALPX','ALTI','ALUB','AMAN','AMAX',
  'AMKL','AMPU','AMZD','AMZY','ANSC','ANY','AOD','APLX','APLY','APMC',
  'APUR','APXT','ARCC','ARCL','ARCX','ARDC','ARMG','ARMH','ARTC','ASG',
  'ASST','ASTN','ASTX','ASTY','ATCH','ATII','AVAT','AVK','AVS','AVXX',
  'AWF','AWP','AXTL','AXTU','AXTX','BABU','BACC','BAIG','BATT','BBCQ',
  'BBDC','BBHM','BBLU','BBN','BCAR','BCAT','BCBP','BCCQU','BCG','BCIC',
  'BCSF','BCSS','BCX','BDCI','BDJ','BDRY','BEAG','BGB','BGC','BGDE',
  'BGH','BGR','BGT','BGX','BGY','BHAV','BHK','BIDWU','BIT','BITO',
  'BITU','BITX','BIZD','BKT','BLNE','BLOX','BLSG','BLW','BMEZ','BMNG',
  'BMNR','BMNU','BNBX','BNKK','BOE','BPRE','BRBS','BREZ','BRKHU','BRR',
  'BRRR','BRW','BSCQ','BSCR','BSCT','BSCU','BSCV','BSOL','BTAL','BTBT',
  'BTCL','BTCS','BTCZ','BTGO','BTX','BTZ','BUYW','BWG','CAES','CAII',
  'CANE','CBRG','CBRX','CCAP','CCAQ','CCCTU','CCIF','CCII','CCIX','CCRP',
  'CCUP','CCXI','CD','CEGX','CEPF','CEPO','CEPT','CEPV','CFFN','CGBD',
  'CGCFU','CHI','CHW','CHY','CIA','CIEG','CIFG','CIFU','CIK','CION',
  'CLM','CLSK','CLSX','CMII','COHH','COIG','COIW','CONL','CONX','CONY',
  'COPY','CORD','CORN','COTG','COZX','CPZ','CRAN','CRCA','CRCD','CRCG',
  'CRCO','CRD-A','CRF','CRMG','CRMU','CRMX','CRPT','CRWG','CRWU','CSEX',
  'CTAA','CUB','CWD','CWVX','CXII','DAAQ','DAMD','DAPP','DBCA','DBL',
  'DBO','DBRG','DDFZ','DDTZ','DFDV','DGAC-U','DGICA','DHF','DHY','DIAL',
  'DIV','DJTU','DLY','DMAA','DMII','DNP','DOMH','DPG','DRAL','DRDB',
  'DRN','DRV','DSL','DSM','DSU','DTCX','DUG','DWSH','DXD','DYNC',
  'EAD','EARN','ECAT','ECC','ECHX','EDD','EDF','EDZ','EEV','EFR',
  'EFT','EHI','EHTH','EIC','EIDO','EIM','EMD','EOD','EOSU','ERC',
  'ERY','ESN','ETH','ETHA','ETHE','ETHT','ETHU','ETHW','ETJ','ETU',
  'ETV','ETW','ETY','EUM','EVAC','EVF','EVN','EVV','EWZS','EXG',
  'EZET','EZRA','FACT','FAX','FBLA','FBY','FCBM','FCRS','FCT','FDD',
  'FDMMU','FETH','FFC','FGMC','FGNX','FGRU','FIGX','FLD','FLG','FLYT',
  'FMAC','FMNB','FNB','FNRN','FOF','FOTO','FPE','FPEI','FPF','FRA',
  'FRBA','FRBT','FRST','FSCO','FSIG','FSK','FSMB','FSOL','FSSL','FTCA',
  'FTF','FTHY','FTMA','FTMH','FTMN','FTMS','FTMU','FTNJ','FTNY','FTPA',
  'FTRA-U','FUTG','FVCB','FWACU','FXAC','GAB','GAIN','GBAB','GBDC','GCGR',
  'GCMG','GCV','GDOT','GDXY','GECC','GEMI','GGN','GGT','GHI','GHXIU',
  'GHY','GIAX','GLED','GLGG','GLNK','GLO','GLQ','GLWG','GLXU','GMEU',
  'GNT','GNW','GOF','GOOY','GPAT','GRAF','GREE','GSBD','GSOL','GSRF',
  'GSRV','GSUI','GUG','GUT','HAPN','HBAN','HBR','HDGE','HFRO','HGBL',
  'HGLB','HGTY','HIO','HIPS','HIVE','HIX','HIYY','HODL','HODU','HOOZ',
  'HOPE','HPI','HPS','HQL','HRZN','HSDT','HTAB','HTGC','HUTG','HYI',
  'HYSA','HYT','IACO','IACQ','IAE','IBTK','IBX','ICLN','ICMB','ICOI',
  'IDX','IEAG','IFLN','IFN','IGD','IGR','IHD','IIM','INFH','INV',
  'IONL','IONZ','IPCX','IPFX','IPST','IPVVU','IQI','IRE','IREG','IREX',
  'IREZ','ISD','ISNRU','ISUL','IVOL','IWMY','JABRU','JACS','JCAP','JETD',
  'JFR','JGH','JOBX','JOF','JONEU','JPC','JQC','JRI','JRS','JRVR',
  'KBDC','KBON','KBWD','KBWY','KEYY','KINS','KIO','KMEM','KMLI','KORU',
  'KPDD','KRAQ','KRNY','KTEC','KTF','KTUP','KWY','KYN','LABD','LCCC',
  'LCDL','LDI','LEO','LEUX','LFGY','LIEN','LIFE','LITP','LITU','LMFA',
  'LOFF','LPAA','LPBB','LPRO','LQTI','LTGRU','LULG','LUNL','MARA','MARO',
  'MBAV','MBI','MBS','MCAH','MCHB','MCN','MDIV','MEGI','MEME','METD',
  'METV','MFIC','MFIN','MFM','MGF','MHD','MHF','MIACU','MIN','MIY',
  'MLAA','MLN','MMD','MMT','MMU','MORT','MPG','MQY','MRCOU','MRNY',
  'MSBT','MSD','MSDL','MSFD','MSFL','MSFO','MSFX','MSIF','MSOS','MSOX',
  'MST','MSTP','MSTU','MSTW','MSTX','MSTY','MSTZ','MTNE-U','MUA','MUC',
  'MUD','MUJ','MULL','MUZ','MYI','MYN','MYX','MZYX','NAC','NAD',
  'NAKA','NAN','NAVI','NBB','NBH','NBIG','NBIZ','NBXG','NCA','NCDL',
  'NCIQ','NCPL','NCV','NCZ','NDMO','NEA','NETG','NEWT','NFBK','NFJ',
  'NFLU','NFLY','NFXL','NHIC','NHIV','NHS','NIKL','NKX','NMAI','NMCO',
  'NMFC','NML','NMZ','NOWL','NPAC','NPB','NPCT','NPFD','NRK','NRO',
  'NSLR','NUV','NVD','NVDG','NVDQ','NVDX','NVDY','NVG','NVOX','NVTX',
  'NVYY','NWBI','NXP','NZF','OBDC','OCAC-U','OCCI','OCSL','OFS','OHAC',
  'OIA','OKLL','OMAH','ONDG','ONDL','ONDU','ONG','ONX','OPEG','OPEX',
  'OPFI','OPP','OPRT','ORCU','ORCX','OSG','OSPRU','OTAI','OTF','OTGA',
  'OWL','OXLC','OXSQ','PATX','PAXS','PBD','PCAP','PCF','PCN','PCQ',
  'PCSC','PDBC','PDDL','PDI','PDO','PDT','PECE','PFFD','PFL','PFLD',
  'PFLT','PFN','PFXF','PGF','PGX','PHK','PILL','PIM','PLMK','PLTA',
  'PLTD','PLTG','PLTM','PLTW','PLU','PLUL','PLUN','PML','PMM','PMO',
  'PNBK','PNI','PNNT','POEL','PONX','PPLT','PPT','PRAA','PRCH','PREF',
  'PSBD','PSEC','PTA','PTIR','PTY','PURR','PWP','PWRL','PYPG','QADR',
  'QAT','QBTX','QBTZ','QCMD','QCML','QID','QLEP','QPUX','QQQD','QRED',
  'QSEA','QSU','QUBX','QYLD','RA','RAAQ','RAC','RACD','RAM','RBLU',
  'RCAX','RCS','RDAG','RDWU','RETL','REXC','RFI','RFMZ','RGTU','RGTX',
  'RGTZ','RIET','RILY','RIOT','RIV','RKLX','RKLZ','RKT','RLTY','RMBI',
  'RMT','RPC','RPHS','RQI','RTAC','RVSB','RVT','RWAY','RWM','RYLD',
  'SABA','SAC','SAGU','SAMO-U','SAR','SBET','SBND','SBTU','SBXE','SCD',
  'SCM','SCOP','SDEV','SDHI','SDHY','SEMY','SHFS','SHNY','SHOTU','SHPU',
  'SIEB','SJB','SKDD','SKHL','SKHU','SKHX','SKHZ','SLNH','SLON','SLQT',
  'SLRC','SMB','SMCL','SMCX','SMCY','SMCZ','SMU','SMUP','SNAG','SNDC',
  'SNDG','SNDQ','SNOY','SNXX','SOFA','SOFI','SOFX','SOLZ','SOUX','SPAL',
  'SPAX','SPCF','SPCH','SPCM','SPCU','SPDN','SPFF','SPKL','SPOG','SPSK',
  'SPXX','SPYT','SSAC','SSG','SSK','SSPC','STEW','STEX','STXU','SUIG',
  'SVAQ','SVIV','SVOL','SWZ','SZZL','TACH','TACO','TAIL','TAVI','TCPC',
  'TDAC','TDF','TDWD','TEI','TETH','TEUP','TFSL','THQ','THW','TILL',
  'TIPT','TIPX','TMS','TNGY','TPVG','TRAD','TRIN','TSDD','TSEG','TSI',
  'TSII','TSL','TSLG','TSLL','TSLQ','TSLT','TSLX','TSLZ','TSMY','TSMZ',
  'TTDU','TVIV','TVIVU','TWAV','TXXD','TYA','UAE','UBRL','UBT','UDN',
  'UECG','UGE','ULTI','UMAL','UNG','UNL','UPSX','USA','USAX','USDE',
  'USGG','USLV','USOY','UUUG','UWMC','UXRP','VACI','VBF','VCV','VEL',
  'VELL','VGM','VGSR','VII-U','VIXM','VKI','VKQ','VLY','VMO','VNM',
  'VVR','WAGN','WARP','WCMI','WDI','WEBS','WENN','WHF','WIW','WSBF',
  'WTID','WTIU','WU','WULF','WYFL','XCBE','XFLT','XNDX','XOMO','XOVR',
  'XRP','XRPC','XRPI','XRPN','XRPZ','XSLL','XXI','XZO','YBTC','YETH',
  'YICCU','YLD','YMAG','YMAX','YQQQ','YYY','ZKP','ZTR',
  ])],
  // LIST 4d: INDUSTRIAL — Industrials sector per Finviz classification.
  //   Real operating companies (aerospace & defense, airlines, electrical
  //   equipment, building products, engineering & construction, trucking/
  //   logistics, staffing, industrial machinery). No ETFs/SPACs/CEFs mixed
  //   in, unlike FINANCIAL.
  INDUSTRIAL: [...new Set([
  'AADX','AAL','ABAT','ACCO','ACHR','ACTG','ADT','AIAI','AIRJ','AIRO',
  'ALTG','AMPX','AP','AQMS','ARLO','ARQ','ASLE','ASPN','AVEX','BAER',
  'BBCP','BCHT','BEEP','BETA','BLNK','BNC','BOC','BOOM','BTOC','BURU',
  'BV','BW','BWEN','BYRN','CEPL','CETY','CIRC','CJMB','CMCO','CODA',
  'CODI','CTNT','CTOS','CVU','CVV','CYRX','DETX','DFLI','DFNS','DLHC',
  'DNOW','EAF','ELMT','ENVX','EOSE','EQPT','ERII','EROC','ESOA','ETS',
  'EVEX','EVI','EVLV','FAC','FBGL','FBYD','FCEL','FIP','FISN','FJET',
  'FLUX','FLY','FLYX','FORR','FTEK','FWRD','GCDT','GPGI','GPUS','GWH',
  'HAWK','HAYW','HDRN','HLMN','HTLD','HTZ','HYLN','ICON','INVE','IPDN',
  'ISSC','ITG','IVDA','JBI','JBLU','JELD','JOB','JOBY','KELYA','KITT',
  'KODK','KSCP','LASE','LNZA','LSH','LTBR','LUNR','LXFR','LZ','MG',
  'MIR','MNTS','MRLN','MRTN','MTRX','MTW','NEOV','NIXX','NL','NMAD',
  'NNBR','NNE','NPKI','NPWR','NTIP','NX','OESX','OFAL','OLOX','OPTT',
  'ORN','PAL','PANL','PBI','PCT','PESI','PEW','PHGE','PLAG','PLUG',
  'POLA','POWW','PPHC','PPSI','QUAD','QXO','RAIL','RCAT','RDW','RFIL',
  'RGP','RJET','RLGT','RR','RUBI','SATL','SBC','SCWO','SDST','SERV',
  'SGLY','SGRP','SHIM','SIDU','SKYX','SLND','SMHI','SMR','SOAR','SPAI',
  'SPCE','SPIR','SRFM','SST','STI','SWBI','SWIM','TBI','TE','TG',
  'TGEN','TH','TIC','TITN','TOMZ','TOPP','TRC','TTI','TUSK','TWI',
  'ULCC','ULH','UP','VATE','VRME','VSTS','VWAV','WNC','XE','XOS',
  'XPON','XRX','XTIA','YSS','ZONE','ZTG',
  ])],
  BROAD: [...new Set([
        // LIST 5: BROAD MARKET
        'AAMC','AAU','AB','ABB','ABCB','ABG','ABIO','ABM','ABNB','AC',
        'ACA','ACCO','ACGL','ACHC','ACIW','ACM','ACNB','ACNT','ACRE','ACRO',
        'ACT','ACU','ACVA','ADBR','ADC','ADCT','ADEA','ADIL','ADMA','ADPT',
        'ADSE','ADTN','ADUS','ADV','ADVM','AE','AEC','AEE','AEFC','AEG',
        'AEHR','AEI','AEIS','AEL','AEMD','AEO','AEON','AER','AES','AESI',
        'AEVA','AEY','AEYE','AEZS','AFBI','AFCG','AFG','AFIB','AFL','AFMD',
        'AFRI','AFT','AFTR','AG','AGCX','AGEN','AGER','AGFY','AGIO','AGIL',
        'AGM','AGMH','AGNC','AGO','AGRI','AGRO','AGRX','AGS','AGTC','AGTI',
        'AGX','AGYS','AHC','AHCO','AHG','AHH','AHPI','AHR','AHT','AI',
        'AIB','AIF','AIG','AIH','AIHS','AIM','AIMC','AIN','AINC','AIO',
        'AIP','AIR','AIRG','AIRI','AIRS','AIRT','AIT','AIV','AIZ','AJG',
        'AJRD','AJX','AKAM','AKBA','AKLI','AKR','AKRO','AKTS','AKTX','AL',
        'ALB','ALBO','ALC','ALCC','ALCE','ALCO','ALDX','ALE','ALEC','ALEX',
        'ALG','ALGM','ALGN','ALGS','ALGT','ALHC','ALIM','ALIN','ALIQ','ALK',
        'ALKS','ALKT','ALL','ALLE','ALLK','ALLM','ALLO','ALLR','ALLT','ALLY',
        'ALNA','ALNY','ALOT','ALPA','ALPN','ALPP','ALR','ALRE','ALRI','ALRM',
        'ALRN','ALRS','ALSA','ALSN','ALT','ALTA','ALTI','ALTO','ALTR','ALV',
        'ALVR','ALX','ALXO','ALZN','AM','AMAL','AMAM','AMAT','AMBA','AMBC',
        'AMBI','AMBO','AMBP','AMC','AMCR','AMCX','AMD','AMEA','AMED','AMEH',
        'AMG','AMGN','AMH','AMHG','AMID','AMKR','AMLI','AMLX','AMN','AMNB',
        'AMOT','AMP','AMPD','AMPG','AMPH','AMPI','AMPL','AMPS','AMPX','AMPY',
        'AMR','AMRC','AMRK','AMRN','AMRS','RXT','RYAM','RYAN','RYI','RYN',
        'RZLT','S','SA','SAA','SABR','SACH','SAFE','SAFM','SAFT','SAGA',
        'SAGE','SAH','SAIA','SAIC','SAIL','SAL','SALM','SAM','SAMA','SAMG',
        'SAN','SAND','SANG','SANW','SAPS','SAR','SARR','SAT','SATB','SATC',
        'SATL','SATO','SAVA','SB','SBBA','SBCF','SBBX','SBCP','SBEV','SBFM',
        'SBGI','SBH','SBI','SBIG','SBKC','SBLT','SBM','SBNY','SBOW','SBRA',
        'SBRY','SBS','SBSW','SBT','SBUX','SC','SCA','SCAC','SCAM','SCCO',
        'SCD','SCE','SCGL','SCHL','SCHN','SCHW','SCI','SCIL','SCKT','SCL',
        'SCLN','SCM','SCND','SCOA','SCON','SCOR','SCPL','SCRG','SCSC','SCU',
        'SCVL','SCWX','SCX','SCYX','SD','SDA','SDBX','SDC','SDGR','SDHY',
        'SDI','SDIG','SDPI','SDR','SE','SEA','SEAC','SEAE','SEAL','SEAS',
        'SEAT','SEB','SECO','SECT','SEDG','SEE','SEED','SEER','SEIC','SELB',
        'SELF','SEM','SEMR','SENEA','SENEB','SENS','SENT','SEPA','SEPC','SEPH',
        'SEQL','SERA','SERS','SES','SESN','SEST','SETO','SF','SFB','SFBS',
        'SFC','SFG','SFI','SFM','SFNC','SFST','SFT','SFTI','SFY','SFYA',
        'SG','SGA','SGBX','SGC','SGEN','SGLY','SGMA','SGML','SGM','SGO',
        'SGOC','SGPA','SGRP','SGRY','SGT','SGTM','SGU','SGY','SHA','SHAK',
        'SHBI','SHC','SHCR','SHEN','SHG','SHI','SHIM','SHLO','SHLS','SHLT',
        'SHLX','SHM','SHNG','SHNI','SHO','SHOO','SHOP','SHOS','SHOT','SHPH',
        'SHPP','SHPX','SHR','SHRC','SHSP','SHU','SHV','SHW','SHY','SHYF',
        'SI','SIA','SIAL','SIBN','SICK','SICO','SID','SIDE','SIEN','SIF',
        'SIFY','SIG','SIGA','SIGI','SIGN','SILK','SILO','SILV','SIM','SIMA',
        'SIMC','SIME','SIMO','SIMP','SINT','SIO','SIOB','SIPP','SIPR','SIR',
        'SIRC','SIRI','SIRO','SISI','SITC','SITE','SITM','SIVB','SIVR','SIX',
        'SIZ','SIZE','SJA','SJC','SJI','SJM','SJR','SJT','SJW','SKA',
        'SKAN','SKAS','SKF','SKI','SKIL','SKM','SKOR','SKT','SKX','SKY',
        'SKYH','SKYE','SKYS','SKYX','SL','SLA','SLAB','SLAM','SLAMU','SLAMW',
        'SLAN','SLANG','SLB','SLCA','SLCR','SLDB','SLDP','SLF','SLG','SLGC',
        'SLGG','SLGL','SLGN','SLI','SLM','SLN','SLNA','SLNG','SLNH','SLNO',
        'SLP','SLQT','SLR','SLRC','SLRN','SLS','SLT','SLTE','SLV','SLVM',
        'SLY','SLYG','SLYV','SM','SMA','SMAC','SMART','SMBF','SMCI','SMCX',
        'SMD','SMDM','SMDR','SME','SMED','SMER','SMET','SMF','SMG','SMHI',
        'SMI','SMID','SMIL','SMIM','SMIT','SMLE','SMLF','SMLG','SMLI','SMLP',
        'SMM','SMMD','SMMF','SMMM','SMN','SMNB','SMNC','SMND','SMNE','SMNF',
        'SMNG','SMNI','SMNJ','SMNK','SMNL','SMNM','SMNN','SMNO','SMNP','SMNQ',
        'SMNR','SMNS','SMNT','SMNU','SMNV','SMNW','SMNX','SMNY','SMNZ','SMO',
        'SMOB','SMOC','SMOD','SMOE','SMOG','SMOH','SMOI','SMOJ','SMOK','SMOL',
        'SMOM','SMON','SMOP','SMOQ','SMOR','SMOS','SMOT','SMOU','SMOV','SMOW',
        'SMOX','SMOY','SMOZ','SMP','SMPL','SMR','SMRT','SMSI','SMT','SMTA',
        'SMTC','SMTG','SMTH','SMTI','SMTL','SMTM','SMTN','SMTO','SMTP','SMTR',
        'SMTS','SMTU','SMTW','SMTX','SMTY','SMTZ','SMU','SMUC','SMUD','SMUE',
        'SMUF','SMUG','SMUH','SMUI','SMUJ','SMUK','SMUL','SMUM','SMUN','SMUP',
        'SMUQ','SMUR','SMUS','SMUT','SMUU','SMUV','SMUW','SMUX','SMUY','SMUZ',
        'SMV','SMVA','SMVC','SMVD','SMVE','SMVF','SMVG','SMVH','SMVI','SMVJ',
        'SMVK','SMVL','SMVM','SMVN','SMVP','SMVQ','SMVR','SMVS','SMVT','SMVU',
        'SMVV','SMVW','SMVX','SMVY','SMVZ','SMW','SMWA','SMWB','SMWC','SMWD',
        'SMWE','SMWF','SMWG','SMWH','SMWI','SMWJ','SMWK','SMWL','SMWM','SMWN',
        'SMWP','SMWQ','SMWR','SMWS','SMWT','SMWU','SMWV','SMWW','SMWX','SMWY',
        'SMWZ','SMX','SMY','SMZ','SN','SNA','SNAC','SNAX','SNB','SNBR',
        'SNC','SNCE','SND','SNDA','SNDL','SNDR','SNDX','SNEX','SNF','SNFCA',
        'SNG','SNGX','SNH','SNHG','SNI','SNII','SNLN','SNMP','SNN','SNO',
        'SNOW','SNPO','SNR','SNRH','SNRM','SNSE','SNV','SNX','SNY','SO',
        'SOA','SOAC','SOAD','SOAE','SOAF','SOAG','SOAH','SOAI','SOAJ','SOAK',
        'SOAL','SOAM','SOAN','SOAP','SOAQ','SOAR','SOAS','SOAT','SOAU','SOAV',
        'SOAW','SOAX','SOAY','SOAZ','SOB','SOBE','SOBL','SOBO','SOBS','SOC',
        'SOCA','SOCC','SOCE','SOCF','SOCG','SOCH','SOCI','SOCJ','SOCK','SOCL',
        'SOCM','SOCN','SOCO','SOCP','SOCQ','SOCR','SOCS','SOCT','SOCU','SOCV',
        'SOCW','SOCX','SOCY','SOCZ','SOD','SODA','SODB','SODC','SODD','SODE',
        'SODF','SODG','SODH','SODI','SODJ','SODK','SODL','SODM','SODN','SODO',
        'SODP','SODQ','SODR','SODS','SODT','SODU','SODV','SODW','SODX','SODY',
        'SODZ','SOE','SOEA','SOEB','SOEC','SOED','SOEE','SOEF','SOEG','SOEH',
        'SOEI','SOEJ','SOEK','SOEL','SOEM','SOEN','SOEO','SOEP','SOEQ','SOER',
        'SOES','SOET','SOEU','SOEV','SOEW','SOEX','SOEY','SOEZ','SOF','SOFI',
        'SOFL','SOFO','SOFT','SOG','SOGA','SOGB','SOGC','SOGD','SOGE','SOGF',
        'SOGG','SOGH','SOGI','SOGJ','SOGK','SOGL','SOGM','SOGN','SOGO','SOGP',
        'SOGQ','SOGR','SOGS','SOGT','SOGU','SOGV','SOGW','SOGX','SOGY','SOGZ',
        'SOH','SOHO','SOHU','SOI','SOIL','SOIR','SOJC','SOK','SOL','SOLA',
        'SOLN','SOLO','SOLR','SOLV','SOM','SOMA','SOMB','SOMC','SOMD','SOME',
        'SOMF','SOMG','SOMH','SOMI','SOMJ','SOMK','SOML','SOMM','SOMN','SOMO',
        'SOMP','SOMQ','SOMR','SOMS','SOMT','SOMU','SOMV','SOMW','SOMX','SOMY',
        'SOMZ','SON','SONA','SONM','SONO','SONT','SUNY','SOP','SOPA','SOPH',
        'SOPI','SOPR','SOQ','SOR','SORE','SORI','SORN','SORS','SORT','SOS',
        'SOT','SOTA','SOTK','SOU','SOUR','SOUTH','SOV','SOWG','SOX','SOY',
        'SPA','SPAC','SPAH','SPAI','SPAM','SPAN','SPAR','SPAS','SPAT','SPAV',
        'SPAX','SPB','SPBC','SPC','SPCA','SPCB','SPCE','SPCF','SPCG','SPCH',
        'SPCN','SPCO','SPCP','SPCQ','SPCR','SPCS','SPCT','SPCU','SPCV','SPCW',
        'SPCX','SPCY','SPCZ','SPD','SPDE','SPDN','SPDR','SPE','SPEC','SPEM',
        'SPEN','SPEP','SPER','SPEX','SPF','SPFI','SPFR','SPG','SPGC','SPGI',
        'SPGP','SPGS','SPH','SPHA','SPHB','SPHC','SPHD','SPHE','SPHF','SPHG',
        'SPHH','SPHI','SPHJ','SPHK','SPHL','SPHM','SPHN','SPHO','SPHP','SPHQ',
        'SPHR','SPHS','SPHT','SPHU','SPHV','SPHW','SPHX','SPHY','SPHZ','SPI',
        'SPIB','SPIC','SPIE','SPIL','SPIN','SPIR','SPIX','SPK','SPKB','SPKC',
        'SPKD','SPKE','SPKF','SPKG','SPKH','SPKI','SPKJ','SPKK','SPKL','SPKM',
        'SPKN','SPKO','SPKP','SPKQ','SPKR','SPKS','SPKT','SPKU','SPKV','SPKW',
        'SPKX','SPKY','SPKZ','SPL','SPLA','SPLB','SPLC','SPLD','SPLE','SPLF',
        'SPLG','SPLH','SPLI','SPLJ','SPLK','SPLL','SPLM','SPLN','SPLO','SPLP',
        'SPLQ','SPLR','SPLS','SPLT','SPLU','SPLV','SPLW','SPLX','SPLY','SPLZ',
        'SPM','SPMA','SPMB','SPMC','SPMD','SPME','SPMF','SPMG','SPMH','SPMI',
        'SPMJ','SPMK','SPML','SPMM','SPMN','SPMO','SPMP','SPMQ','SPMR','SPMS',
        'SPMT','SPMU','SPMV','SPMW','SPMX','SPMY','SPMZ','SPN','SPNA','SPNB',
        'SPNC','SPND','SPNE','SPNF','SPNG','SPNH','SPNI','SPNJ','SPNK','SPNL',
        'SPNM','SPNN','SPNO','SPNP','SPNQ','SPNR','SPNS','SPNT','SPNU','SPNV',
        'SPNW','SPNX','SPNY','SPNZ','SPO','SPOA','SPOB','SPOC','SPOD','SPOE',
        'SPOF','SPOG','SPOH','SPOI','SPOJ','SPOK','SPOL','SPOM','SPON','SPOP',
        'SPOQ','SPOR','SPOS','SPOT','SPOU','SPOV','SPOW','SPOX','SPOY','SPOZ',
        'SPP','SPPA','SPPB','SPPC','SPPD','SPPE','SPPF','SPPG','SPPH','SPPI',
        'SPPJ','SPPK','SPPL','SPPM','SPPN','SPPO','SPPP','SPPQ','SPPR','SPPS',
        'SPPT','SPPU','SPPV','SPPW','SPPX','SPPY','SPPZ','SPQ','SPQC','SPR',
        'SPRA','SPRB','SPRC','SPRD','SPRE','SPRF','SPRG','SPRH','SPRI','SPRJ',
        'SPRK','SPRL','SPRM','SPRN','SPRO','SPRP','SPRQ','SPRR','SPRS','SPRT',
        'SPRU','SPRV','SPRW','SPRX','SPRY','SPRZ','SPS','SPSA','SPSB','SPSC',
        'SPSD','SPSE','SPSF','SPSG','SPSH','SPSI','SPSJ','SPSK','SPSL','SPSM',
        'SPSN','SPSO','SPSP','SPSQ','SPSR','SPSS','SPST','SPSU','SPSV','SPSW',
        'SPSX','SPSY','SPSZ','SPT','SPTA','SPTB','SPTC','SPTD','SPTE','SPTF',
        'SPTG','SPTH','SPTI','SPTJ','SPTK','SPTL','SPTM','SPTN','SPTO','SPTP',
        'SPTQ','SPTR','SPTS','SPTT','SPTU','SPTV','SPTW','SPTX','SPTY','SPTZ',
        'SPU','SPUA','SPUB','SPUC','SPUD','SPUE','SPUF','SPUG','SPUH','SPUI',
        'SPUJ','SPUK','SPUL','SPUM','SPUN','SPUO','SPUP','SPUQ','SPUR','SPUS',
        'SPUT','SPUU','SPUV','SPUW','SPUX','SPUY','SPUZ','SPV','SPVA','SPVB',
        'SPVC','SPVD','SPVE','SPVF','SPVG','SPVH','SPVI','SPVJ','SPVK','SPVL',
        'SPVM','SPVN','SPVO','SPVP','SPVQ','SPVR','SPVS','SPVT','SPVU','SPVV',
        'SPVW','SPVX','SPVY','SPVZ','SPW','SPWA','SPWB','SPWC','SPWD','SPWE',
        'SPWF','SPWG','SPWH','SPWI','SPWJ','SPWK','SPWL','SPWM','SPWN','SPWO',
        'SPWP','SPWQ','SPWR','SPWS','SPWT','SPWU','SPWV','SPWW','SPWX','SPWY',
        'SPWZ','SPX','SPXA','SPXB','SPXC','SPXD','SPXE','SPXF','SPXG','SPXH',
        'SPXI','SPXJ','SPXK','SPXL','SPXM','SPXN','SPXO','SPXP','SPXQ','SPXR',
        'SPXS','SPXT','SPXU','SPXV','SPXW','SPXX','SPXY','SPXZ','SPY','SPYA',
        'SPYB','SPYC','SPYD','SPYE','SPYF','SPYG','SPYH','SPYI','SPYJ','SPYK',
        'SPYL','SPYM','SPYN','SPYO','SPYP','SPYQ','SPYR','SPYS','SPYT','SPYU',
        'SPYV','SPYW','SPYX','SPYY','SPYZ','SPZ','SQ','SQA','SQB','SQC',
        'SQD','SQE','SQF','SQG','SQH','SQI','SQJ','SQK','SQL','SQLM',
        'SQM','SQN','SQNS','SQO','SQP','SQQ','SQR','SQRE','SQS','SQT',
        'SQU','SQUA','SQV','SQW','SQX','SQY','SQZ','SR','SRA','SRAD',
        'SRAX','SRB','SRBANK','SRC','SRCE','SRCL','SRD','SRDA','SRE','SREL',
        'SREV','SRF','SRG','SRGA','SRH','SRHI','SRI','SRIL','SRJ','SRK',
        'SRL','SRLU','SRM','SRMC','SRMD','SRN','SRNE','SRO','SROP','SRP',
        'SRPT','SRQ','SRR','SRRA','SRS','SRSA','SRT','SRTS','SRU','SRV',
        'SRVA','SRVR','SRW','SRX','SRY','SRZ','SS','SSA','SSAB','SSAC',
        'SSB','SSBI','SSC','SSCC','SSCD','SSCE','SSCI','SSCO','SSCP','SSCR',
        'SSD','SSEA','SSEB','SSEC','SSED','SSEE','SSEF','SSEG','SSEH','SSEI',
        'SSEJ','SSEK','SSEL','SSEM','SSEN','SSEO','SSEP','SSEQ','SSER','SSES',
        'SSET','SSEU','SSEV','SSEW','SSEX','SSEY','SSEZ','SSF','SSG','SSGA',
        'SSH','SSHI','SSI','SSIC','SSIL','SSIV','SSJ','SSK','SSL','SSLEY',
        'SSM','SSNC','SSNT','SSNZ','SSO','SSOA','SSOD','SSP','SSPK','SSPL',
        'SSPR','SSQ','SSR','SSRE','SSRI','SSRM','SSS','SSSA','SST','SSTA',
        'SSTI','SSTK','SSTM','SSU','SSV','SSW','SSWA','SSX','SSY','SSYS',
        'SSZ','ST','STA','STAA','STAB','STAC','STAF','STAG','STAI','STAL',
        'STAM','STAR','STAS','STAT','STAV','STAX','STBA','STBC','STC','STCA',
        'STCB','STCD','STCE','STCF','STCG','STCH','STCI','STCJ','STCK','STCL',
        'STCM','STCN','STCO','STCP','STCQ','STCR','STCS','STCT','STCU','STCV',
        'STCW','STCX','STCY','STCZ','STD','STDA','STDB','STDC','STDD','STDE',
        'STDF','STDG','STDH','STDI','STDJ','STDK','STDL','STDM','STDN','STDO',
        'STDP','STDQ','STDR','STDS','STDT','STDU','STDV','STDW','STDX','STDY',
        'STDZ','STE','STEA','STEB','STEC','STED','STEE','STEF','STEG','STEH',
        'STEI','STEJ','STEK','STEL','STEM','STEN','STER','STET','STEU','STEV',
        'STEW','STEX','STEY','STEZ','STF','STFA','STFB','STFC','STFD','STFE',
        'STFF','STFG','STFH','STFI','STFJ','STFK','STFL','STFM','STFN','STFO',
        'STFP','STFQ','STFR','STFS','STFT','STFU','STFV','STFW','STFX','STFY',
        'STFZ','STG','STGA','STGD','STGE','STGF','STGG','STGH','STGI','STGJ',
        'STGK','STGL','STGM','STGN','STGO','STGP','STGQ','STGR','STGS','STGT',
        'STGU','STGV','STGW','STGX','STGY','STGZ','STH','STHA','STHB','STHC',
        'STHD','STHE','STHF','STHG','STHH','STHI','STHJ','STHK','STHL','STHM',
        'STHN','STHO','STHP','STHQ','STHR','STHS','STHT','STHU','STHV','STHW',
        'STHX','STHY','STHZ','STI','STIA','STIB','STIC','STID','STIE','STIF',
        'STIG','STIH','STII','STIJ','STIK','STIL','STIM','STIN','STIO','STIP',
        'STIQ','STIR','STIS','STIT','STIU','STIV','STIW','STIX','STIY','STIZ',
        'STK','STKA','STKB','STKC','STKD','STKE','STKF','STKG','STKH','STKI',
        'STKJ','STKK','STKL','STKM','STKN','STKO','STKP','STKQ','STKR','STKS',
        'STKT','STKU','STKV','STKW','STKX','STKY','STKZ','STL','STLA','STLD',
        'STLG','STLI','STLL','STLM','STLN','STLO','STLP','STLQ','STLR','STLS',
        'STLT','STLU','STLV','STLW','STLX','STLY','STLZ','STM','STMA','STMB',
        'STMC','STMD','STME','STMF','STMG','STMH','STMI','STMJ','STMK','STML',
        'STMM','STMN','STMO','STMP','STMQ','STMR','STMS','STMT','STMU','STMV',
        'STMW','STMX','STMY','STMZ','STN','STNA','STNB','STNC','STND','STNE',
        'STNF','STNG','STNH','STNI','STNJ','STNK','STNL','STNM','STNN','STNO',
        'STNP','STNQ','STNR','STNS','STNT','STNU','STNV','STNW','STNX','STNY',
        'STNZ','STO','STOA','STOB','STOC','STOD','STOE','STOF','STOG','STOH',
        'STOI','STOJ','STOK','STOL','STOM','STON','STOP','STOQ','STOR','STOS',
        'STOT','STOU','STOV','STOW','STOX','STOY','STOZ','STP','STPA','STPB',
        'STPC','STPD','STPE','STPF','STPG','STPH','STPI','STPJ','STPK','STPL',
        'STPM','STPN','STPO','STPP','STPQ','STPR','STPS','STPT','STPU','STPV',
        'STPW','STPX','STPY','STPZ','STQ','STR','STRA','STRB','STRC','STRD',
        'STRE','STRF','STRG','STRH','STRI','STRJ','STRK','STRL','STRM','STRN',
        'STRO','STRP','STRQ','STRR','STRS','STRT','STRU','STRV','STRW','STRX',
        'STRY','STRZ','STS','STSA','STSB','STSC','STSD','STSE','STSF','STSG',
        'STSH','STSI','STSJ','STSK','STSL','STSM','STSN','STSO','STSP','STSQ',
        'STSR','STSS','STST','STSU','STSV','STSW','STSX','STSY','STSZ','STT',
        'STTA','STTB','STTC','STTD','STTE','STTF','STTG','STTH','STTI','STTJ',
        'STTK','STTL','STTM','STTN','STTO','STTP','STTQ','STTR','STTS','STTT',
        'STTU','STTV','STTW','STTX','STTY','STTZ','STU','STUA','STUB','STUC',
        'STUD','STUE','STUF','STUG','STUH','STUI','STUJ','STUK','STUL','STUM',
        'STUN','STUO','STUP','STUQ','STUR','STUS','STUT','STUU','STUV','STUW',
        'STUX','STUY','STUZ','STV','STVA','STVB','STVC','STVD','STVE','STVF',
        'STVG','STVH','STVI','STVJ','STVK','STVL','STVM','STVN','STVO','STVP',
        'STVQ','STVR','STVS','STVT','STVU','STVV','STVW','STVX','STVY','STVZ',
        'STW','STWA','STWB','STWC','STWD','STWE','STWF','STWG','STWH','STWI',
        'STWJ','STWK','STWL','STWM','STWN','STWO','STWP','STWQ','STWR','STWS',
        'STWT','STWU','STWV','STWW','STWX','STWY','STWZ','STX','STXA','STXB',
        'STXC','STXD','STXE','STXF','STXG','STXH','STXI','STXJ','STXK','STXL',
        'STXM','STXN','STXO','STXP','STXQ','STXR','STXS','STXT','STXU','STXV',
        'STXW','STXX','STXY','STXZ','STY','STYA','STYB','STYC','STYD','STYE',
        'STYF','STYG','STYH','STYI','STYJ','STYK','STYL','STYM','STYN','STYO',
        'STYP','STYQ','STYR','STYS','STYT','STYU','STYV','STYW','STYX','STYY',
        'STYZ','STZ','SU','SUA','SUAC','SUAM','SUB','SUBC','SUBI','SUBL',
        'SUBX','SUC','SUCB','SUCC','SUCD','SUCE','SUCF','SUCG','SUCH','SUCI',
        'SUCJ','SUCK','SUCL','SUCM','SUCN','SUCO','SUCP','SUCQ','SUCR','SUCS',
        'SUCT','SUCU','SUCV','SUCW','SUCX','SUCY','SUCZ','SUD','SUDA','SUDB',
        'SUDC','SUDD','SUDE','SUDF','SUDG','SUDH','SUDI','SUDJ','SUDK','SUDL',
        'SUDM','SUDN','SUDO','SUDP','SUDQ','SUDR','SUDS','SUDT','SUDU','SUDV',
        'SUDW','SUDX','SUDY','SUDZ','SUE','SUEA','SUEB','SUEC','SUED','SUEE',
        'SUEF','SUEG','SUEH','SUEI','SUEJ','SUEK','SUEL','SUEM','SUEN','SUEO',
        'SUEP','SUEQ','SUER','SUES','SUET','SUEU','SUEV','SUEW','SUEX','SUEY',
        'SUEZ','SUF','SUFA','SUFB','SUFC','SUFD','SUFE','SUFF','SUFG','SUFH',
        'SUFI','SUFJ','SUFK','SUFL','SUFM','SUFN','SUFO','SUFP','SUFQ','SUFR',
        'SUFS','SUFT','SUFU','SUFV','SUFW','SUFX','SUFY','SUFZ','SUG','SUGA',
        'SUGD','SUGE','SUGF','SUGG','SUGH','SUGI','SUGJ','SUGK','SUGL','SUGM',
        'SUGN','SUGO','SUGP','SUGQ','SUGR','SUGS','SUGT','SUGU','SUGV','SUGW',
        'SUGX','SUGY','SUGZ','SUH','SUI','SUIP','SULL','SUM','SUMA','SUMB',
        'SUMC','SUMD','SUME','SUMF','SUMG','SUMH','SUMI','SUMJ','SUMK','SUML',
        'SUMM','SUMN','SUMO','SUMP','SUMQ','SUMR','SUMS','SUMT','SUMU','SUMV',
        'SUMW','SUMX','SUMY','SUMZ','SUN','SUNA','SUNB','SUNC','SUND','SUNE',
        'SUNF','SUNG','SUNH','SUNI','SUNJ','SUNK','SUNL','SUNM','SUNN','SUNO',
        'SUNP','SUNQ','SUNR','SUNS','SUNT','SUNU','SUNV','SUNW','SUNX','SUNZ',
        'SUP','SUPA','SUPB','SUPC','SUPD','SUPE','SUPF','SUPG','SUPH','SUPI',
        'SUPJ','SUPK','SUPL','SUPM','SUPN','SUPO','SUPP','SUPQ','SUPR','SUPS',
        'SUPT','SUPU','SUPV','SUPW','SUPX','SUPY','SUPZ','SUQ','SUR','SURA',
        'SURB','SURC','SURD','SURE','SURF','SURG','SURH','SURI','SURJ','SURK',
        'SURL','SURM','SURN','SURO','SURP','SURQ','SURR','SURS','SURT','SURU',
        'SURV','SURW','SURX','SURY','SURZ','SUS','SUSA','SUSB','SUSC','SUSD',
        'SUSE','SUSF','SUSG','SUSH','SUSI','SUSJ','SUSK','SUSL','SUSM','SUSN',
        'SUSO','SUSP','SUSQ','SUSR','SUSS','SUST','SUSU','SUSV','SUSW','SUSX',
        'SUSY','SUSZ','SUT','SUTA','SUTB','SUTC','SUTD','SUTE','SUTF','SUTG',
        'SUTH','SUTI','SUTJ','SUTK','SUTL','SUTM','SUTN','SUTO','SUTP','SUTQ',
        'SUTR','SUTS','SUTT','SUTU','SUTV','SUTW','SUTX','SUTY','SUTZ','SUU',
        'SUV','SUVA','SUVB','SUVC','SUVD','SUVE','SUVF','SVG','SVH','SVI',
        'SVT','SVV','SWAG','SWAN','SWK','SWKH','SWM','SWN','SWX','SWY',
        'SXC','SXE','SXO','SXT','SY','SYA','SYB','SYBT','SYC','SYF',
        'SYK','SYL','SYLA','SYM','SYMA','SYMS','SYN','SYNA','SYNC','SYND',
        'SYNE','SYNH','SYNL','SYNO','SYNT','SYPR','SYT','SYTA','SYV','SYX',
        'SYY','SYZ','TA','TAA','TAAC','TAB','TABC','TABR','TAC','TACA',
        'TACB','TACC','TACD','TACE','TACF','TACG','TACH','TACI','TACJ','TACK',
        'TACL','TACM','TACN','TACO','TACP','TACQ','TACR','TACS','TACT','TACU',
        'TACV','TACW','TACX','TACY','TACZ','TAD','TADA','TADB','TADC','TADD',
        'TADE','TADF','TADG','TADH','TADI','TADJ','TADK','TADL','TADM','TADN',
        'TADO','TADP','TADQ','TADR','TADS','TADT','TADU','TADV','TADW','TADX',
        'TADY','TADZ','TAE','TAEE','TAF','TAFA','TAFB','TAFC','TAFD','TAFE',
        'TAFF','TAFG','TAFH','TAFI','TAFJ','TAFK','TAFL','TAFM','TAFN','TAFO',
        'TAFP','TAFQ','TAFR','TAFS','TAFT','TAFU','TAFV','TAFW','TAFX','TAFY',
        'TAFZ','TAG','TAGA','TAGB','TAGC','TAGD','TAGE','TAGF','TAGG','TAGH',
        'TAGI','TAGJ','TAGK','TAGL','TAGM','TAGN','TAGO','TAGP','TAGQ','TAGR',
        'TAGS','TAGT','TAGU','TAGV','TAGW','TAGX','TAGY','TAGZ','TAH','TAHA',
        'TAI','TAIA','TAID','TAIL','TAIN','TAIP','TAIR','TAIT','TAIV','TAJA',
        'TAK','TAKA','TAKB','TAKC','TAKD','TAKE','TAKF','TAKG','TAKH','TAKI',
        'TAKJ','TAKK','TAKL','TAKM','TAKN','TAKO','TAKP','TAKQ','TAKR','TAKS',
        'TAKT','TAKU','TAKV','TAKW','TAKX','TAKY','TAKZ','TAL','TALA','TALB',
        'TALC','TALD','TALE','TALF','TALG','TALH','TALI','TALJ','TALK','TALL',
        'TALM','TALN','TALO','TALP','TALQ','TALR','TALS','TALT','TALU','TALV',
        'TALW','TALX','TALY','TALZ','TAM','TAMA','TAMB','TAMC','TAMD','TAME',
        'TAMF','TAMG','TAMH','TAMI','TAMJ','TAMK','TAML','TAMM','TAMN','TAMO',
        'TAMP','TAMQ','TAMR','TAMS','TAMT','TAMU','TAMV','TAMW','TAMX','TAMY',
        'TAMZ','TAN','TANA','TANB','TANC','TAND','TANE','TANF','TANG','TANH',
        'TANI','TANJ','TANK','TANL','TANM','TANN','TANO','TANP','TANQ','TANR',
        'TANS','TANT','TANU','TANV','TANW','TANX','TANY','TANZ','TAO','TAOP',
        'TAP','TAPA','TAPB','TAPC','TAPD','TAPE','TAPF','TAPG','TAPH','TAPI',
        'TAPJ','TAPK','TAPL','TAPM','TAPN','TAPO','TAPP','TAPQ','TAPR','TAPS',
        'TAPT','TAPU','TAPV','TAPW','TAPX','TAPY','TAPZ','TAQ','TAQC','TAR',
        'TARA','TARB','TARC','TARD','TARE','TARF','TARG','TARH','TARI','TARJ',
        'TARK','TARL','TARM','TARN','TARO','TARP','TARQ','TARR','TARS','TART',
        'TARU','TARV','TARW','TARX','TARY','TARZ','TAS','TASA','TASB','TASC',
        'TASD','TASE','TASF','TASG','TASH','TASI','TASJ','TASK','TASL','TASM',
        'TASN','TASO','TASP','TASQ','TASR','TASS','TAST','TASU','TASV','TASW',
        'TASX','TASY','TASZ','TAT','TATA','TATB','TATC','TATD','TATE','TATF',
        'TATG','TATH','TATI','TATJ','TATK','TATL','TATM','TATN','TATO','TATP',
        'TATQ','TATR','TATS','TATT','TATU','TATV','TATW','TATX','TATY','TATZ',
        'TAU','TAUA','TAUB','TAUC','TAUD','TAUE','TAUF','TAUG','TAUH','TAUI',
        'TAUJ','TAUK','TAUL','TAUM','TAUN','TAUO','TAUP','TAUQ','TAUR','TAUS',
        'TAUT','TAUU','TAUV','TAUW','TAUX','TAUY','TAUZ','TAV','TAVA','TAVB',
        'TAVC','TAVD','TAVE','TAVF','TAVG','TAVH','TAVI','TAVJ','TAVK','TAVL',
        'TAVM','TAVN','TAVO','TAVP','TAVQ','TAVR','TAVS','TAVT','TAVU','TAVV',
        'TAVW','TAVX','TAVY','TAVZ','TAW','TAWA','TAWB','TAWC','TAWD','TAWE',
        'TAWF','TAWG','TAWH','TAWI','TAWJ','TAWK','TAWL','TAWM','TAWN','TAWO',
        'TAWP','TAWQ','TAWR','TAWS','TAWT','TAWU','TAWV','TAWW','TAWX','TAWY',
        'TAWZ','TAX','TAXA','TAXB','TAXC','TAXD','TAXE','TAXF','TAXG','TAXH',
        'TAXI','TAXJ','TAXK','TAXL','TAXM','TAXN','TAXO','TAXP','TAXQ','TAXR',
        'TAXS','TAXT','TAXU','TAXV','TAXW','TAXX','TAXY','TAXZ','TAY','TAYA',
        'TAYB','TAYC','TAYD','TAYE','TAYF','TAYG','TAYH','TAYI','TAYJ','TAYK',
        'TAYL','TAYM','TAYN','TAYO','TAYP','TAYQ','TAYR','TAYS','TAYT','TAYU',
        'TAYV','TAYX','TAYY','TAYZ','TAZ','TAZA','TAZB','TAZC','TAZD','TAZE',
        'TAZF','TAZG','TAZH','TAZI','TAZJ','TAZK','TAZL','TAZM','TAZN','TAZO',
        'TAZP','TAZQ','TAZR','TAZS','TAZT','TAZU','TAZV','TAZW','TAZX','TAZY',
        'TAZZ','TB','TBA','TBAA','TBAC','TBB','TBBB','TBC','TBCC','TBD',
        'TBDA','TBE','TBED','TBF','TBFA','TBFB','TBFC','TBFD','TBFE','TBFF',
        'TBFG','TBFH','TBFI','TBFJ','TBFK','TBFL','TBFM','TBFN','TBFO','TBFP',
        'TBFQ','TBFR','TBFS','TBFT','TBFU','TBFV','TBFW','TBFX','TBFY','TBFZ',
        'TBG','TBGA','TBGB','TBGC','TBGD','TBGE','TBGF','TBGG','TBGH','TBGI',
        'TBGJ','TBGK','TBGL','TBGM','TBGN','TBGO','TBGP','TBGQ','TBGR','TBGS',
        'TBGT','TBGU','TBGV','TBGW','TBGX','TBGY','TBGZ','TBH','TBHA','TBI',
        'TBIA','TBID','TBIK','TBIL','TBIO','TBIP','TBIR','TBIT','TBIV','TBJA',
        'TBK','TBKA','TBKB','TBKC','TBKD','TBKE','TBKF','TBKG','TBKH','TBKI',
        'TBKJ','TBKK','TBKL','TBKM','TBKN','TBKO','TBKP','TBKQ','TBKR','TBKS',
        'TBKT','TBKU','TBKV','TBKW','TBKX','TBKY','TBKZ','TBL','TBLA','TBLB',
        'TBLC','TBLD','TBLE','TBLF','TBLG','TBLH','TBLI','TBLJ','TBLK','TBLL',
        'TBLM','TBLN','TBLO','TBLP','TBLQ','TBLR','TBLS','TBLT','TBLU','TBLV',
        'TBLW','TBLX','TBLY','TBLZ','TBM','TBMA','TBMB','TBMC','TBMD','TBME',
        'TBMF','TBMG','TBMH','TBMI','TBMJ','TBMK','TBML','TBMM','TBMN','TBMO',
        'TBMP','TBMQ','TBMR','TBMS','TBMT','TBMU','TBMV','TBMW','TBMX','TBMY',
        'TBMZ','TBN','TBNA','TBNB','TBNC','TBND','TBNE','TBNF','TBNG','TBNH',
        'TBNI','TBNJ','TBNK','TBNL','TBNM','TBNN','TBNO','TBNP','TBNQ','TBNR',
        'TBNS','TBNT','TBNU','TBNV','TBNW','TBNX','TBNY','TBNZ','TBO','TBOA',
        'TBOB','TBOC','TBOD','TBOE','TBOF','TBOG','TBOH','TBOI','TBOJ','TBOK',
        'TBOL','TBOM','TBON','TBOP','TBOQ','TBOR','TBOS','TBOT','TBOU','TBOV',
        'TBOW','TBOX','TBOY','TBOZ','TBP','TBPA','TBPB','TBPC','TBPD','TBPE',
        'TBPF','TBPG','TBPH','TBPI','TBPJ','TBPK','TBPL','TBPM','TBPN','TBPO',
        'TBPP','TBPQ','TBPR','TBPS','TBPT','TBPU','TBPV','TBPW','TBPX','TBPY',
        'TBPZ','TBQ','TBQC','TBR','TBRA','TBRB','TBRC','TBRD','TBRE','TBRF',
        'TBRG','TBRH','TBRI','TBRJ','TBRK','TBRL','TBRM','TBRN','TBRO','TBRP',
        'TBRQ','TBRR','TBRS','TBRT','TBRU','TBRV','TBRW','TBRX','TBRY','TBRZ',
        'TBS','TBSA','TBSB','TBSC','TBSD','TBSE','TBSF','TBSG','TBSH','TBSI',
        'TBSJ','TBSK','TBSL','TBSM','TBSN','TBSO','TBSP','TBSQ','TBSR','TBSS',
        'TBST','TBSU','TBSV','TBSW','TBSX','TBSY','TBSZ','TBT','TBTA','TBTB',
        'TBTC','TBTD','TBTE','TBTF','TBTG','TBTH','TBTI','TBTJ','TBTK','TBTL',
        'TBTM','TBTN','TBTO','TBTP','TBTQ','TBTR','TBTS','TBTT','TBTU','TBTV',
        'TBTW','TBTX','TBTY','TBTZ','TBU','TBUA','TBUB','TBUC','TBUD','TBUE',
        'TBUF','TBUG','TBUH','TBUI','TBUJ','TBUK','TBUL','TBUM','TBUN','TBUO',
        'TBUP','TBUQ','TBUR','TBUS','TBUT','TBUU','TBUV','TBUW','TBUX','TBUY',
        'TBUZ','TBV','TBVA','TBVB','TBVC','TBVD','TBVE','TBVF','TBVG','TBVH',
        'TBVI','TBVJ','TBVK','TBVL','TBVM','TBVN','TBVO','TBVP','TBVQ','TBVR',
        'TBVS','TBVT','TBVU','TBVV','TBVW','TBVX','TBVY','TBVZ','TBW','TBWA',
        'TBWB','TBWC','TBWD','TBWE','TBWF','TBWG','TBWH','TBWI','TBWJ','TBWK',
        'TBWL','TBWM','TBWN','TBWO','TBWP','TBWQ','TBWR','TBWS','TBWT','TBWU',
        'TBWV','TBWW','TBWX','TBWY','TBWZ','TBX','TBXA','TBXB','TBXC','TBXD',
        'TBXE','TBXF','TBXG','TBXH','TBXI','TBXJ','TBXK','TBXL','TBXM','TBXN',
        'TBXO','TBXP','TBXQ','TBXR','TBXS','TBXT','TBXU','TBXV','TBXW','TBXX',
        'TBXY','TBXZ','TBY','TBYA','TBYB','TBYC','TBYD','TBYE','TBYF','TBYG',
        'TBYH','TBYI','TBYJ','TBYK','TBYL','TBYM','TBYN','TBYO','TBYP','TBYQ',
        'TBYR','TBYS','TBYT','TBYU','TBYV','TBYW','TBYX','TBYY','TBYZ','TBZ',
        'TBZA','TBZB','TBZC','TBZD','TBZE','TBZF','TBZG','TBZH','TBZI','TBZJ',
        'TBZK','TBZL','TBZM','TBZN','TBZO','TBZP','TBZQ','TBZR','TBZS','TBZT',
        'TBZU','TBZV','TBZW','TBZX','TBZY','TBZZ',
        ])]
};
const MASTER_TICKERS = STOCK_UNIVERSES.BROAD;
let TICKERS = MASTER_TICKERS;

const COMPANY_NAMES = {
  'SNDL':'SNDL Inc.','CLOV':'Clover Health','MVIS':'MicroVision','WKHS':'Workhorse Group',
  'GOEV':'Canoo Inc.','SPWR':'SunPower','PLUG':'Plug Power','FCEL':'FuelCell Energy',
  'BLNK':'Blink Charging','IDEX':'Ideanomics','ZOM':'Zomedica','CPRX':'Catalyst Pharma',
  'CRON':'Cronos Group','ACB':'Aurora Cannabis','TLRY':'Tilray Brands','COTY':'Coty Inc.',
  'F':'Ford Motor','SNAP':'Snap Inc.','SOFI':'SoFi Technologies','HOOD':'Robinhood Markets',
  'LCID':'Lucid Group','XPEV':'XPeng Inc.','NIO':'NIO Inc.','MARA':'Marathon Digital',
  'RIOT':'Riot Platforms','HUT':'Hut 8 Mining','BITF':'Bitfarms','CLSK':'CleanSpark',
  'CIFR':'Cipher Mining','KOSS':'Koss Corp','EXPR':'Express Inc.','AMC':'AMC Entertainment',
  'FFIE':'Faraday Future','MULN':'Mullen Automotive','XELA':'Exela Technologies',
  'KPLT':'Katapult Holdings','GFAI':'Guardforce AI','OCGN':'Ocugen Inc.',
  'INO':'Inovio Pharma','NVAX':'Novavax','SRNE':'Sorrento Therapeutics',
  'ATOS':'Atossa Therapeutics','CTIC':'CTI BioPharma','JAGX':'Jaguar Health',
  'LXRX':'Lexicon Pharma','OCUL':'Ocular Therapeutix','RILY':'B. Riley Financial',
  'SAVA':'Cassava Sciences','UAVS':'AgEagle Aerial','VNRX':'VolitionRx',
  'WTER':'Alkaline Water','YCBD':'cbdMD','NKLA':'Nikola Corp','RIDE':'Lordstown Motors',
  'HYLN':'Hyliion Holdings','ARBK':'Argo Blockchain','HIVE':'Hive Blockchain',
  'VERB':'Verb Technology','PHUN':'Phunware','CSSE':'Chicken Soup for the Soul',
  'PAYA':'Paya Holdings','PDSB':'PDS Biotech','ALBT':'Avalon GloboCare',
  'AEYE':'AudioEye','SEEL':'Seelos Biosciences','CPIX':'Cumberland Pharma',
  'NCPL':'Netcapital','HCWB':'HCW Biologics','CHRS':'Coherus BioSciences',
  'MTSL':'MiMedia Inc.','MVST':'Microvast','WATT':'Energous Corp','VVPR':'VivoPower',
  'SIGA':'SIGA Technologies','BLPH':'Bellerophon Therapeutics','OBSV':'ObsEva SA',
  'VBIV':'VBI Vaccines','CIDM':'Cinedigm','CYTH':'Cyclerion Therapeutics',
  'DFFN':'Diffusion Pharma','GNPX':'Genprobe','INFI':'Infinity Pharma',
  'KMPH':'KemPharm','MYOV':'Myovant Sciences','NBSE':'NeuBase Therapeutics',
  'PRPO':'Precipio Diagnostics','QLGN':'Qualigen Therapeutics','TPVG':'TriplePoint Venture',
  'XBIO':'Xenon Pharma','ZSAN':'Zosano Pharma','OGEN':'Oragenics',
  'APHA':'Aphria Inc.','SFIX':'Stitch Fix','WISH':'ContextLogic','RIVN':'Rivian Automotive',
  'BBBY':'Bed Bath & Beyond','GME':'GameStop','NEXT':'NextDecade','AULT':'Ault Global Holdings',
  'MDJM':'Mdjm Ltd','LIZI':'Lizhan Environmental'
};

const NEG_KEYWORDS = ['recall','lawsuit','fraud','investigation','bankruptcy','downgrade','loss report','criminal'];

const HOLIDAYS = new Set([
  '2024-01-01','2024-01-15','2024-02-19','2024-03-29','2024-05-27',
  '2024-06-19','2024-07-04','2024-09-02','2024-11-28','2024-12-25',
  '2025-01-01','2025-01-20','2025-02-17','2025-04-18','2025-05-26',
  '2025-06-19','2025-07-04','2025-09-01','2025-11-27','2025-12-25',
  '2026-01-01','2026-01-19','2026-02-16','2026-04-03','2026-05-25',
  '2026-06-19','2026-07-03','2026-09-07','2026-11-26','2026-12-25'
]);

// ── 2. STATE ─────────────────────────────────────────────────────

let state = {
  settings: {},
  portfolio: [],
  sold: [],
  signals: [],
  news: [],
  lastScanTime: null,
  activeTab: 'signals',
  filters: { priceRange: 'all', duration: 'all' },
  signalToggles: { strongBuy: true, softBuy: true, watch: true },
  aiCache: {},         // ticker → {bullets, tip} — session only
  portfolioPrices: {}, // ticker → live price — session only
  ahSnapshots: {},     // ticker → SIP snapshot — session only, AH mode
  spyChange: 0,        // SPY today % change — updated each screener run
  macroContext: null,  // { changes, condition, ambiguous, source, explanation, fetchedAt } — session only, fetched once
  soldCurrentPrices: {}, // ticker → current price
  loading: false,
  _confirmCb: null,
  lastPassedCount: 0,
  selectedUniverse: 'BROAD',
  notifications: {},     // push notification state — persisted
};

function loadState() {
  ['settings','portfolio','sold','signals','lastScanTime','news','signalToggles','lastPassedCount','selectedUniverse','notifications'].forEach(k => {
    const raw = localStorage.getItem('edge_' + k);
    if (raw) { try { state[k] = JSON.parse(raw); } catch(e) {} }
  });
  state.settings = Object.assign({
    alpacaKey: '', alpacaSecret: '', groqKey: '',
    budget: 500, includeUnder2: false, showWatch: true, minVolume: 100000
  }, state.settings);
  state.notifications = Object.assign({
    enabled: true, permission: 'default',
    lastPriceCheck: null, lastDailyCheck: null, alertHistory: {}
  }, state.notifications);
  state.signalToggles = Object.assign(
    { strongBuy: true, softBuy: true, watch: true },
    state.signalToggles
  );
  if (!state.selectedUniverse) state.selectedUniverse = 'BROAD';
  const baseList = STOCK_UNIVERSES[state.selectedUniverse] || MASTER_TICKERS;
  TICKERS = baseList.length ? baseList : MASTER_TICKERS;
}

function persist(key) {
  try { localStorage.setItem('edge_' + key, JSON.stringify(state[key])); } catch(e) {}
}

// Single source of truth for "is this ticker in Portfolio". Reads localStorage
// directly rather than state.portfolio so it can never disagree with what's
// actually persisted, and normalizes both sides so casing/whitespace can't
// cause a false negative.
function getOwnedPosition(ticker) {
  let portfolio = [];
  try {
    const raw = localStorage.getItem('edge_portfolio');
    portfolio = raw ? JSON.parse(raw) : [];
  } catch(e) { portfolio = []; }

  const needle = String(ticker || '').trim().toUpperCase();
  if (!needle) return null;

  return portfolio.find(p => String(p.ticker || '').trim().toUpperCase() === needle) || null;
}

// ── 3. PACIFIC TIME / MARKET STATUS ─────────────────────────────

function getPT(date = new Date()) {
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
}

function ptDateStr(pt) {
  return pt.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

function isTradingDay(pt) {
  const dow = pt.getDay();
  if (dow === 0 || dow === 6) return false;
  return !HOLIDAYS.has(ptDateStr(pt));
}

function getMarketStatus() {
  const pt = getPT();
  const h = pt.getHours(), m = pt.getMinutes();
  const tMin = h * 60 + m;
  const trading = isTradingDay(pt);

  if (trading && tMin >= 390 && tMin < 780) {   // 6:30am–1:00pm
    const left = 780 - tMin;
    return { status:'OPEN', label:'MARKET OPEN', color:'#00ff88',
             countdown:`Closes in ${Math.floor(left/60)}h ${left%60}m`, isOpen:true };
  }
  if (trading && tMin >= 60 && tMin < 390) {     // 1:00am–6:30am
    const left = 390 - tMin;
    return { status:'PRE', label:'PRE-MARKET', color:'#ffd166',
             countdown:`Opens in ${Math.floor(left/60)}h ${left%60}m`, isOpen:false };
  }
  if (trading && tMin >= 780 && tMin < 1020) {   // 1:00pm–5:00pm
    const left = 1020 - tMin;
    return { status:'AH', label:'AFTER HOURS', color:'#ffd166',
             countdown:`Extended hours end in ${Math.floor(left/60)}h ${left%60}m`, isOpen:false };
  }

  // Closed — find next open
  const cd = getCountdownToOpen();
  return { status:'CLOSED', label:'MARKET CLOSED', color:'#4a6070',
           countdown:`Opens in ${cd}`, isOpen:false };
}

function getCountdownToOpen() {
  const now = new Date();
  for (let d = 0; d <= 10; d++) {
    const check = new Date(now);
    check.setDate(now.getDate() + d);
    const ptCheck = getPT(check);
    if (!isTradingDay(ptCheck)) continue;

    const ptOpen = new Date(check);
    const ptNow = getPT(now);
    const ptOpenForToday = new Date(ptNow);
    ptOpenForToday.setHours(6, 30, 0, 0);

    const dayPT = new Date(ptNow);
    dayPT.setDate(ptNow.getDate() + d);
    dayPT.setHours(6, 30, 0, 0);

    const diffMs = dayPT - ptNow;
    if (diffMs > 0) {
      const mins = Math.floor(diffMs / 60000);
      return `${Math.floor(mins/60)}h ${mins%60}m`;
    }
  }
  return '—';
}

function isAfternoonMode() {
  const pt = getPT();
  const tMin = pt.getHours() * 60 + pt.getMinutes();
  return tMin >= 720; // 12:00pm Pacific
}

// Change 11 (Scoring Formula v2 addendum): DAY trade signals go stale fast —
// after 10am Pacific there's too little of the trading day left for an
// intraday target to be realistic. Window is 10am-5pm PT (covers OPEN+AH);
// once the market is fully CLOSED the existing marketClosed overlay already
// communicates that, and this window can never overlap CLOSED by construction
// (600-1020 min falls entirely inside OPEN[390,780) + AH[780,1020)).
function isDayTradeSuppressed(duration) {
  if (duration !== 'DAY') return false;
  const pt = getPT();
  if (!isTradingDay(pt)) return false;
  const tMin = pt.getHours() * 60 + pt.getMinutes();
  return tMin >= 600 && tMin < 1020; // 10:00am-5:00pm Pacific
}

function isPreMarketHours() {
  const pt = getPT();
  const tMin = pt.getHours() * 60 + pt.getMinutes();
  return isTradingDay(pt) && tMin >= 60 && tMin < 390;
}

function isAfterHoursMode() {
  return getMarketStatus().status === 'AH';
}

function getAHData(ticker) {
  const snap = state.ahSnapshots[ticker];
  if (!snap) return null;
  const ahPrice = snap.latestTrade?.p;
  const regClose = snap.dailyBar?.c;
  if (!ahPrice || !regClose || ahPrice === regClose) return null;
  const ahChangePct = ((ahPrice - regClose) / regClose) * 100;
  return { ahPrice, regClose, ahChangePct };
}

function updateMarketBanner() {
  const ms = getMarketStatus();
  const el = document.getElementById('market-banner');
  if (!el) return;
  el.style.color = ms.color;
  el.innerHTML = `
    <div>
      <span class="market-status-dot" style="background:${ms.color}"></span>
      <strong>${ms.label}</strong>
    </div>
    <span class="market-countdown">${ms.countdown}</span>
  `;
}


// ── 4. BUDGET BAR ────────────────────────────────────────────────

function updateBudgetBar() {
  const el = document.getElementById('budget-bar');
  const tab = state.activeTab;
  if (!el) return;

  if (!['signals','portfolio'].includes(tab)) {
    el.classList.add('hidden');
    return;
  }

  const budget = parseFloat(state.settings.budget) || 0;
  const deployed = state.portfolio.reduce((sum, p) => sum + (p.shares * p.buyPrice), 0);
  const avail = budget - deployed;
  const availClass = avail >= 0 ? 'pos' : 'neg';

  el.classList.remove('hidden');
  el.innerHTML = `
    <span>Budget: <strong class="mono">$${budget.toFixed(2)}</strong></span>
    <span>Deployed: <strong class="mono">$${deployed.toFixed(2)}</strong></span>
    <span>Available: <strong class="mono ${availClass}">$${avail.toFixed(2)}</strong></span>
  `;
}

// ── 5. FRESHNESS ──────────────────────────────────────────────────

function getFreshnessHtml(triggerId) {
  const ms = getMarketStatus();
  if (ms.status === 'CLOSED') return '';
  if (!state.lastScanTime) return '';
  const age = Math.floor((Date.now() - state.lastScanTime) / 60000);
  if (age < 30) return `<div class="freshness-warn ok">Data from ${age} min ago</div>`;
  if (age < 60)
    return `<div class="freshness-warn stale" onclick="handleRefresh()">⚠ Data is ${age} min old — tap to refresh</div>`;
  return `<div class="freshness-warn old" onclick="handleRefresh()">🔴 Stale data — refresh now</div>`;
}

// ── 6. ALPACA API ─────────────────────────────────────────────────

function alpacaHeaders() {
  return {
    'APCA-API-KEY-ID': state.settings.alpacaKey,
    'APCA-API-SECRET-KEY': state.settings.alpacaSecret,
  };
}

async function alpacaGet(path, params = {}) {
  const url = new URL(ALPACA_BASE + path);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const r = await fetch(url.toString(), { headers: alpacaHeaders() });
  if (!r.ok) throw new Error(`Alpaca ${r.status}: ${await r.text()}`);
  return r.json();
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function fetchSnapshots(tickers, onProgress) {
  const results = {};
  let done = 0;
  for (const batch of chunk(tickers, 100)) {
    const data = await alpacaGet('/stocks/snapshots', { symbols: batch.join(','), feed:'iex' });
    Object.assign(results, data);
    done += batch.length;
    if (onProgress) onProgress(done, tickers.length);
  }
  return results;
}

// Alpaca silently omits unrecognized symbols from snapshot results rather than
// erroring, so an unresolved ticker just vanishes with no signal. This flags it
// loudly (once per scan) for the handful of tickers we already know are at risk
// — see UNVERIFIED_HYPHEN_SYMBOLS.
function checkUnresolvedSymbols(requestedTickers, snapshots) {
  const requested = new Set(requestedTickers);
  const missing = UNVERIFIED_HYPHEN_SYMBOLS.filter(sym => requested.has(sym) && !snapshots[sym]);
  if (missing.length) {
    console.warn(`Unresolved symbol(s) — no Alpaca snapshot returned, likely a format/listing mismatch: ${missing.join(', ')}`);
  }
}

async function fetchAHSnapshots(tickers) {
  const results = {};
  for (const batch of chunk(tickers, 100)) {
    try {
      const data = await alpacaGet('/stocks/snapshots', { symbols: batch.join(','), feed:'sip' });
      Object.assign(results, data);
    } catch(e) { console.warn('AH snapshot error', e.message); }
  }
  return results;
}

async function fetchMultiBars(tickers, limit = 100) {
  if (!tickers.length) return {};
  const results = {};
  const start = (() => {
    const d = new Date(); d.setDate(d.getDate() - 180); return d.toISOString().split('T')[0];
  })();
  for (const batch of chunk(tickers, 30)) {
    try {
      const data = await alpacaGet('/stocks/bars', {
        symbols: batch.join(','), timeframe:'1Day', start, limit, sort:'asc', feed:'iex'
      });
      if (data.bars) Object.assign(results, data.bars);
    } catch(e) { console.warn('bars batch error', e.message); }
  }
  return results;
}

async function fetchSingleBars(ticker, limit = 300) {
  const start = (() => {
    const d = new Date(); d.setDate(d.getDate() - 450); return d.toISOString().split('T')[0];
  })();
  try {
    const data = await alpacaGet(`/stocks/${ticker}/bars`, {
      timeframe:'1Day', start, limit, sort:'asc', feed:'iex'
    });
    return data.bars || [];
  } catch(e) { return []; }
}

async function fetchHourlyBars(ticker) {
  const d = new Date(); d.setDate(d.getDate() - 4);
  const start = d.toISOString().split('T')[0];
  try {
    const data = await alpacaGet(`/stocks/${ticker}/bars`, {
      timeframe: '1Hour', start, limit: 200, sort: 'asc', feed: 'iex'
    });
    return data.bars || [];
  } catch(e) { return []; }
}

async function fetchNewsForTickers(tickers) {
  if (!tickers.length) return [];
  try {
    const syms = tickers.slice(0, 50).join(',');
    const data = await alpacaGet('/news', { symbols: syms, limit: 50, sort:'desc' });
    return data.news || [];
  } catch(e) { return []; }
}

async function testAlpacaConnection() {
  try {
    await alpacaGet('/stocks/snapshots', { symbols: 'AAPL', feed:'iex' });
    return true;
  } catch(e) { return false; }
}

// ── 6b. MACRO MARKET OVERLAY ─────────────────────────────────────

// Step 1: pattern-match today's ETF moves into a market condition.
// Evaluated in spec order — `matched` preserves that order so matched[0] is the
// first-match winner; matched.length > 1 signals an ambiguous day for Step 2 (Groq).
function classifyMacroCondition(changes) {
  const spy = changes.SPY || 0;
  const xle = changes.XLE || 0;
  const xlk = changes.XLK || 0;
  const xbi = changes.XBI || 0;
  const xlf = changes.XLF || 0;
  const sectors = [xle, xlk, xbi, xlf];

  const matched = [];

  // RISK_OFF — VIX removed (unavailable via Alpaca /stocks); substituted with
  // a breadth check (3+ of 4 sector ETFs also negative) to keep the "broad
  // panic, everything dropping" intent. Confirmed with Roman before implementing.
  if (spy <= -2 && sectors.filter(v => v < 0).length >= 3) matched.push('RISK_OFF');

  if (spy <= -1 && xle >= 1) matched.push('GEOPOLITICAL');

  if (xlk <= -1.5 && (xle >= 0.5 || xlf >= 0.5)) matched.push('TECH_ROTATION_OUT');

  if (spy >= 1 && sectors.filter(v => v > 0).length >= 3) matched.push('BROAD_RALLY');

  if (spy >= 1.5 && xlk >= 1.5) matched.push('MOMENTUM_DAY');

  // Sector weakness — SPY flat or only mildly down (<1%)
  if (spy > -1) {
    if (xbi <= -1.5) matched.push('SECTOR_WEAKNESS_BIOTECH');
    if (xle <= -1.5) matched.push('SECTOR_WEAKNESS_ENERGY');
    if (xlk <= -1.5) matched.push('SECTOR_WEAKNESS_TECH');
  }

  const condition = matched.length ? matched[0] : 'CHOPPY';
  return { condition, matched };
}

// Fetches today's % change for the macro ETF basket and pattern-matches a
// market condition. Called once per session (see runScreener) — result is
// cached on state.macroContext, not re-fetched per scan or per card.
async function fetchMacroContext() {
  let changes;
  try {
    const snaps = await fetchSnapshots(MACRO_ETFS);
    changes = {};
    MACRO_ETFS.forEach(t => {
      const snap = snaps[t];
      const price = snap?.dailyBar?.c || snap?.latestTrade?.p || 0;
      const prevClose = snap?.prevDailyBar?.c || price;
      changes[t] = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;
    });
  } catch(e) {
    console.warn('Macro context fetch error', e.message);
    return null;
  }

  const { condition, matched } = classifyMacroCondition(changes);

  const context = {
    changes,             // { SPY, XLE, XLK, XBI, XLF } — % change today
    condition,            // pattern-match result (Step 1); may be revised by Groq in Step 2
    matchedConditions: matched,
    ambiguous: matched.length > 1,
    source: 'pattern',    // becomes 'groq' if Step 2 resolves it
    explanation: null,    // populated by Groq in Step 2
    fetchedAt: Date.now(),
  };

  // Step 2: only call Groq when the pattern match is ambiguous or CHOPPY.
  // fetchMacroContext() itself only runs once per session (see runScreener),
  // so this single call is the session-level cache — no separate cache needed.
  if (condition === 'CHOPPY' || context.ambiguous) {
    const resolved = await resolveMacroConditionWithGroq(changes);
    if (resolved) {
      context.condition = resolved.condition;
      context.explanation = resolved.explanation;
      context.source = 'groq';
    }
    // else: Groq unavailable/failed — context.condition stays the Step 1
    // pattern-match result (CHOPPY, or the first ambiguous match), per spec.
  }

  return context;
}

// Step 2: fetch the last 5 SPY/QQQ headlines from the last 6 hours, for the
// Groq clarification prompt.
async function fetchMacroHeadlines() {
  const news = await fetchNewsForTickers(['SPY', 'QQQ']);
  const cutoff = Date.now() - 6 * 3600000;
  return news
    .filter(n => new Date(n.created_at).getTime() >= cutoff)
    .slice(0, 5);
}

function buildMacroGroqPrompt(changes, headlines) {
  const headlineLines = headlines.length
    ? headlines.map(h => h.headline).join('\n')
    : '(no recent headlines available)';
  return `You are a macro market analyst. Based on these ETF movements and headlines,
classify today's market condition as exactly one of:
RISK_OFF, GEOPOLITICAL, TECH_ROTATION_OUT, BROAD_RALLY, MOMENTUM_DAY,
SECTOR_WEAKNESS_BIOTECH, SECTOR_WEAKNESS_ENERGY, SECTOR_WEAKNESS_TECH, CHOPPY

ETF movements today:
SPY: ${changes.SPY.toFixed(2)}%
XLE: ${changes.XLE.toFixed(2)}%
XLK: ${changes.XLK.toFixed(2)}%
XBI: ${changes.XBI.toFixed(2)}%
XLF: ${changes.XLF.toFixed(2)}%

Recent market headlines:
${headlineLines}

Respond with ONLY the condition label and a single sentence explanation.
Example: "GEOPOLITICAL — Oil prices spiking on Middle East tensions driving
energy up while broad market sells off."`;
}

// Step 2: single Groq call to resolve an ambiguous/CHOPPY pattern match.
// Returns { condition, explanation } on success, or null on any failure
// (missing key, network error, unparseable response) so the caller falls
// back to the Step 1 pattern-match result.
async function resolveMacroConditionWithGroq(changes) {
  const key = state.settings.groqKey;
  if (!key) return null;

  try {
    const headlines = await fetchMacroHeadlines();
    const prompt = buildMacroGroqPrompt(changes, headlines);

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 150
      })
    });
    if (!r.ok) throw new Error(`Groq ${r.status}`);
    const data = await r.json();
    const text = (data.choices?.[0]?.message?.content || '').trim().replace(/^["']|["']$/g, '');

    const re = new RegExp(`^\\**\\s*(${MACRO_CONDITIONS.join('|')})\\**\\s*[—-]+\\s*(.*)$`, 's');
    const match = text.match(re);
    if (!match) return null;

    return { condition: match[1], explanation: match[2].trim() };
  } catch(e) {
    console.warn('Macro Groq resolution error', e.message);
    return null;
  }
}

// Step 3: category-specific score adjustments. Keys match state.selectedUniverse
// (HEALTHCARE/ENERGY/TECH/RETAIL/FINANCIAL/BROAD), which is also how category
// is threaded into scoreStock() — see "How category is stored" note at the Macro
// Overlay call site. RETAIL currently mirrors TECH's values as a placeholder
// until its universe is verified and its own macro sensitivity is characterized.
// FINANCIAL and INDUSTRIAL start at 0 for every condition (no adjustment)
// since they're mixed/uncharacterized buckets with no dedicated
// SECTOR_WEAKNESS_* condition of their own yet.
const MACRO_ADJUSTMENTS = {
  RISK_OFF:                { HEALTHCARE: -20, ENERGY: -15, TECH: -20, RETAIL: -20, FINANCIAL: 0, INDUSTRIAL: 0, BROAD: -20 },
  GEOPOLITICAL:            { HEALTHCARE: -10, ENERGY:  10, TECH: -15, RETAIL: -15, FINANCIAL: 0, INDUSTRIAL: 0, BROAD: -10 },
  TECH_ROTATION_OUT:       { HEALTHCARE:  -5, ENERGY:  10, TECH: -20, RETAIL: -20, FINANCIAL: 0, INDUSTRIAL: 0, BROAD:  -5 },
  BROAD_RALLY:             { HEALTHCARE:  10, ENERGY:   5, TECH:  10, RETAIL:  10, FINANCIAL: 0, INDUSTRIAL: 0, BROAD:  10 },
  MOMENTUM_DAY:            { HEALTHCARE:   5, ENERGY:   0, TECH:  15, RETAIL:  15, FINANCIAL: 0, INDUSTRIAL: 0, BROAD:   5 },
  SECTOR_WEAKNESS_BIOTECH: { HEALTHCARE: -15, ENERGY:   0, TECH:   0, RETAIL:   0, FINANCIAL: 0, INDUSTRIAL: 0, BROAD:  -5 },
  SECTOR_WEAKNESS_ENERGY:  { HEALTHCARE:   0, ENERGY: -15, TECH:   0, RETAIL:   0, FINANCIAL: 0, INDUSTRIAL: 0, BROAD:  -5 },
  SECTOR_WEAKNESS_TECH:    { HEALTHCARE:   0, ENERGY:   0, TECH: -15, RETAIL: -15, FINANCIAL: 0, INDUSTRIAL: 0, BROAD:  -5 },
  CHOPPY:                  { HEALTHCARE:   0, ENERGY:   0, TECH:   0, RETAIL:   0, FINANCIAL: 0, INDUSTRIAL: 0, BROAD:   0 },
};

function getMacroAdjustment(condition, category) {
  if (!condition || !category) return 0;
  return MACRO_ADJUSTMENTS[condition]?.[category] ?? 0;
}

// Step 4: display helpers. Which ETF(s) to quote in the Score Breakdown row,
// per condition — mirrors the spec's own examples (GEOPOLITICAL: "SPY -1.8%,
// XLE +2.1%"; BROAD_RALLY: "SPY +1.4%").
const MACRO_DISPLAY_ETFS = {
  RISK_OFF: ['SPY'],
  GEOPOLITICAL: ['SPY', 'XLE'],
  TECH_ROTATION_OUT: ['XLK', 'XLE', 'XLF'],
  BROAD_RALLY: ['SPY'],
  MOMENTUM_DAY: ['SPY', 'XLK'],
  SECTOR_WEAKNESS_BIOTECH: ['XBI'],
  SECTOR_WEAKNESS_ENERGY: ['XLE'],
  SECTOR_WEAKNESS_TECH: ['XLK'],
};

function formatMacroConditionDetail(condition, changes) {
  if (!condition || condition === 'CHOPPY' || !changes) return 'mixed signals';
  const etfs = MACRO_DISPLAY_ETFS[condition] || ['SPY'];
  return etfs
    .filter(t => changes[t] != null)
    .map(t => `${t} ${changes[t] >= 0 ? '+' : ''}${changes[t].toFixed(1)}%`)
    .join(', ');
}

// Fallback banner copy when Groq wasn't invoked (clear, unambiguous pattern
// match) — lifted directly from each condition's "Interpretation" line in the
// spec's Step 1 table, so the banner always has something meaningful to show.
const MACRO_INTERPRETATIONS = {
  RISK_OFF: 'Broad panic selling, everything dropping.',
  GEOPOLITICAL: 'Geopolitical event driving oil up while broad market sells.',
  TECH_ROTATION_OUT: 'Money rotating out of tech into value/energy.',
  BROAD_RALLY: 'Genuine broad market strength.',
  MOMENTUM_DAY: 'Risk-on momentum day, growth stocks outperforming.',
  SECTOR_WEAKNESS_BIOTECH: 'Sector-specific selling in biotech, not a broad market event.',
  SECTOR_WEAKNESS_ENERGY: 'Sector-specific selling in energy, not a broad market event.',
  SECTOR_WEAKNESS_TECH: 'Sector-specific selling in tech, not a broad market event.',
};

// Signals tab banner — omitted entirely on CHOPPY days per spec ("no clutter
// on normal days").
function buildMacroBanner() {
  const ctx = state.macroContext;
  if (!ctx || !ctx.condition || ctx.condition === 'CHOPPY') return '';
  const text = ctx.explanation || MACRO_INTERPRETATIONS[ctx.condition] || '';
  return `<div class="macro-banner">📊 <strong>${ctx.condition}</strong> — ${text}</div>`;
}

// ── 7. GROQ API ───────────────────────────────────────────────────

async function groqAnalyze(ticker, prompt) {
  const key = state.settings.groqKey;
  if (!key) throw new Error('No Groq key');

  if (state.aiCache[ticker]) return state.aiCache[ticker];

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 512
    })
  });
  if (!r.ok) throw new Error(`Groq ${r.status}`);
  const data = await r.json();
  const text = data.choices?.[0]?.message?.content || '';

  const result = { answers: parseAIAnswers(text) };
  state.aiCache[ticker] = result;
  return result;
}

// Category -> most relevant single sector ETF for the "Relevant sector ETF
// today" line in buildAIPrompt(). BROAD has no single relevant sector (SPY
// already covers it), so it's intentionally absent — callers must handle null.
function getSectorETFForCategory(category) {
  // RETAIL: XLY is a placeholder pending a verified Retail-sector ETF choice.
  // FINANCIAL: XLF is already one of the macro overlay ETFs (MACRO_ETFS), so
  // this mapping is consistent with the rest of the macro system by construction.
  // INDUSTRIAL: XLI was added to MACRO_ETFS specifically to back this mapping.
  return { HEALTHCARE: 'XBI', ENERGY: 'XLE', TECH: 'XLK', RETAIL: 'XLY', FINANCIAL: 'XLF', INDUSTRIAL: 'XLI' }[category] || null;
}

// Unified Groq prompt for both owned and unowned stocks — replaces the old
// buildAIPromptOwned/buildAIPromptCandidate split. `pos` is the result of
// getOwnedPosition(ticker), or null/undefined for an unowned candidate.
function buildAIPrompt(stock, pos) {
  const livePrice = stock.livePrice ?? stock.price;
  const liveRsi = stock.liveRsi ?? stock.rsi;
  const todayChange = stock.todayChange ?? 0;
  const duration = pos ? pos.duration : stock.duration;
  const entry = pos ? pos.buyPrice : stock.entry;
  const stop = pos ? pos.stop : stock.stop;
  const aboveBelow = livePrice > stock.ma20 ? 'ABOVE' : 'BELOW';

  let prompt = `You are a short-term trading analyst. A retail investor is asking for
your independent opinion on this stock based on raw data only. Form your
own view — do not default to any pre-existing recommendation.

Stock: ${stock.ticker} (${stock.company || stock.ticker})
Current price: $${livePrice.toFixed(2)}
Today's change: ${todayChange.toFixed(2)}%
RSI (14-day): ${liveRsi.toFixed(1)}
Volume ratio vs 10-day average: ${stock.volRatio.toFixed(2)}x
Signal score: ${stock.score}/100
Risk score: ${stock.risk}/10
Trade duration classification: ${duration}
Entry/target/stop: $${entry.toFixed(2)} → $${stock.target.toFixed(2)} → $${stop.toFixed(2)}
20-day MA: $${stock.ma20.toFixed(2)}
Price vs MA: ${aboveBelow}
`;

  // Macro context — omitted entirely if state.macroContext hasn't loaded.
  if (state.macroContext) {
    const ctx = state.macroContext;
    const explanation = ctx.explanation || MACRO_INTERPRETATIONS[ctx.condition] || '';
    const spyPct = ctx.changes?.SPY;
    const category = stock.category || state.selectedUniverse || 'BROAD';
    const sectorETF = getSectorETFForCategory(category);
    const sectorPct = sectorETF ? ctx.changes?.[sectorETF] : null;

    prompt += `
Current market condition: ${ctx.condition}
Market context: ${explanation}
SPY today: ${spyPct != null ? `${spyPct>=0?'+':''}${spyPct.toFixed(2)}` : 'N/A'}%`;
    if (sectorETF && sectorPct != null) {
      prompt += `\nRelevant sector ETF (${sectorETF}) today: ${sectorPct>=0?'+':''}${sectorPct.toFixed(2)}%`;
    }
    prompt += '\n';
  }

  if (pos) {
    const days = Math.floor((Date.now() - new Date(pos.buyDate).getTime()) / 86400000);
    const pnlDollar = (livePrice - pos.buyPrice) * pos.shares;
    const pnlPct = ((livePrice - pos.buyPrice) / pos.buyPrice) * 100;

    prompt += `
Position status:
  Purchased at: $${pos.buyPrice.toFixed(2)}
  Unrealized P&L: ${pnlDollar>=0?'+':''}$${pnlDollar.toFixed(2)} (${pnlPct>=0?'+':''}${pnlPct.toFixed(1)}%)
  Days held: ${days} of intended ${durHoldLabel(pos.duration)} trade
  Original target: $${pos.target.toFixed(2)}
  Live target: $${stock.target.toFixed(2)}

Answer these three questions:
1. HOLD or SELL — your independent recommendation in one sentence, based only on the data above. Do not reference any app warning or system recommendation.
2. What the price action and indicators are telling you right now in 2-3 sentences, factoring in the macro condition.
3. Probability this stock reaches the live target before hitting the stop-loss, as a percentage with one sentence explaining what would need to happen.

Be direct. No disclaimers. Base everything strictly on the data provided.`;
  } else {
    prompt += `
Answer these three questions:
1. BUY NOW or WAIT — your independent recommendation in one sentence, based only on the data above.
2. What makes this an opportunity or a risk right now in 2-3 sentences, factoring in the macro condition.
3. Risk of waiting — what could change in the next 24 hours that would make this setup worse or disappear, in one sentence.

Be direct. No disclaimers. Base everything strictly on the data provided.`;
  }

  return prompt;
}

function parseAIAnswers(text) {
  const lines = text.split('\n');
  const answers = ['', '', ''];
  let current = -1;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^\**\s*([1-3])[\.\)]\s*(.*)$/);
    if (m) {
      current = parseInt(m[1], 10) - 1;
      answers[current] = m[2];
    } else if (current >= 0) {
      answers[current] += (answers[current] ? ' ' : '') + line.replace(/^[-•*]\s*/, '');
    }
  }

  return answers.filter(Boolean);
}

async function testGroqConnection() {
  const key = state.settings.groqKey;
  if (!key) return false;
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: 'Say OK.' }],
        max_tokens: 5
      })
    });
    return r.ok;
  } catch(e) { return false; }
}

// ── 8. TECHNICAL INDICATORS ───────────────────────────────────────

function calcRSI(closes) {
  if (closes.length < 15) return 50;
  const last15 = closes.slice(-15);
  let gains = 0, losses = 0;
  for (let i = 1; i < 15; i++) {
    const d = last15[i] - last15[i-1];
    if (d > 0) gains += d; else losses += Math.abs(d);
  }
  const avgGain = gains / 14;
  const avgLoss = losses / 14;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calcATR(bars) {
  if (bars.length < 15) return 0;
  const last15 = bars.slice(-15);
  let sum = 0;
  for (let i = 1; i < 15; i++) {
    const b = last15[i], prev = last15[i-1];
    const tr = Math.max(b.h - b.l, Math.abs(b.h - prev.c), Math.abs(b.l - prev.c));
    sum += tr;
  }
  return sum / 14;
}

// Trimmed ATR — drops the single highest True Range day before averaging, so one
// spike (FDA news, short squeeze) doesn't inflate the target/stop for the next 14 days.
// Used ONLY for target/stop (calcEntryTargetStop). Risk Score keeps using calcATR (untrimmed).
function calcTrimmedATR(bars) {
  if (bars.length < 15) return 0;
  const last15 = bars.slice(-15);
  const trueRanges = [];
  for (let i = 1; i < 15; i++) {
    const b = last15[i], prev = last15[i-1];
    trueRanges.push(Math.max(b.h - b.l, Math.abs(b.h - prev.c), Math.abs(b.l - prev.c)));
  }
  const sorted = [...trueRanges].sort((a, b) => a - b);
  return sorted.slice(0, 13).reduce((sum, x) => sum + x, 0) / 13;
}

function calcMA(closes, period) {
  if (closes.length < period) return closes[closes.length - 1] || 0;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function calcAvgVolume(volumes, days) {
  if (!volumes.length) return 0;
  const slice = volumes.slice(-Math.min(days, volumes.length));
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

// ── Duration label helpers ─────────────────────────────────────────
function durBadgeClass(duration) {
  return duration === 'DAY' ? 'badge-day' : duration === '3-DAY' ? 'badge-swing' : 'badge-week';
}
function durBadgeText(duration) {
  return duration === 'DAY' ? 'EXIT TODAY' : duration === '3-DAY' ? 'EST. 2-4 DAYS' : 'EST. 5-7 DAYS';
}
function durHoldLabel(duration) {
  return duration === 'DAY' ? 'exit today' : duration === '3-DAY' ? 'est. 2-4 day' : 'est. 5-7 day';
}

// ── 9. SCORING ENGINE ─────────────────────────────────────────────

function classifyDuration(rsi, volRatio, closes) {
  const rsi3ago = closes.length >= 17 ? calcRSI(closes.slice(0, -3)) : rsi;
  const rsiTrending = rsi > rsi3ago;

  if (rsi > 68 || volRatio > 3) return 'DAY';

  if (rsi >= 48 && rsi <= 60 && rsiTrending && volRatio >= 1.2 && volRatio <= 1.8)
    return 'WEEK';

  if (rsi >= 52 && rsi <= 68 && volRatio >= 1.5 && volRatio <= 3)
    return '3-DAY';

  if (rsi > 65) return 'DAY';
  if (rsi < 50) return 'WEEK';
  return '3-DAY';
}

function calcEntryTargetStop(price, atr, duration, resistance = {}) {
  const entry = price;
  const atrFloor = Math.max(atr, price * 0.02); // minimum 2% of price
  let tMult, sMult;
  switch (duration) {
    case 'DAY':   tMult = 1.0; sMult = 0.75; break;
    case '3-DAY': tMult = 2.0; sMult = 1.0;  break;
    case 'WEEK':  tMult = 3.5; sMult = 1.5;  break;
    default:      tMult = 1.5; sMult = 1.0;
  }
  const rawTarget = entry + atrFloor * tMult;

  // Cap raw target at nearest resistance ceiling above entry (52wk high, swing high, or 20-day MA)
  const { high52, swingHigh10, ma20 } = resistance;
  const levels = [];
  if (high52 != null)      levels.push({ price: high52 * 0.98,      label: '52-week high' });
  if (swingHigh10 != null) levels.push({ price: swingHigh10 * 0.99, label: 'recent swing high' });
  if (ma20 != null && price < ma20) levels.push({ price: ma20 * 0.99, label: '20-day MA' });

  const applicable = levels.filter(l => l.price > entry);
  let target = rawTarget, cappedBy = null;
  if (applicable.length) {
    const nearest = applicable.reduce((a, b) => (b.price < a.price ? b : a));
    if (rawTarget > nearest.price) { target = nearest.price; cappedBy = nearest.label; }
  }
  target = Math.max(target, entry * 1.02);

  return {
    entry,
    target,
    stop: Math.min(entry - atrFloor * sMult, entry * 0.95),
    cappedBy
  };
}

function calcRiskScore(price, atr, rsi, volRatio, hasNegNews) {
  let r = price < 4 ? 6 : price < 10 ? 4 : 3;
  const atrPct = price > 0 ? (atr / price) * 100 : 0;
  if (atrPct > 10) r += 2; else if (atrPct > 6) r += 1;
  if (rsi > 75 || rsi < 30) r += 2;
  if (hasNegNews) r += 2;
  return Math.min(10, Math.max(1, r));
}

function scoreStock(ticker, snap, bars, newsItem, spyChangePct = 0, category = null) {
  const price = snap.dailyBar?.c || snap.latestTrade?.p || 0;
  const prevClose = snap.prevDailyBar?.c || price;
  const volume = snap.dailyBar?.v || 0;

  if (bars.length < 15) return null;

  const sorted = [...bars].sort((a,b) => new Date(a.t) - new Date(b.t));
  const closes = sorted.map(b => b.c);
  const vols   = sorted.map(b => b.v);

  const rsi = calcRSI(closes);
  const atr = calcATR(sorted); // simple/untrimmed — feeds Risk Score only
  const trimmedAtr = calcTrimmedATR(sorted); // feeds target/stop only
  const ma20 = calcMA(closes, 20);
  const avgVol10 = calcAvgVolume(vols, 10);
  const volRatio = avgVol10 > 0 ? volume / avgVol10 : 1;
  const todayChange = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;

  const duration = classifyDuration(rsi, volRatio, closes);
  // Resistance levels for target capping (Change 6). Window is whatever bars are
  // available (~100-125 trading days from the screener fetch), not a true 252-day
  // 52-week window — treated as an approximation per product decision.
  const high52 = Math.max(...sorted.map(b => b.h));
  const last10ExclToday = sorted.slice(-11, -1);
  const swingHigh10 = last10ExclToday.length ? Math.max(...last10ExclToday.map(b => b.h)) : null;
  const { entry, target, stop, cappedBy } = calcEntryTargetStop(price, trimmedAtr, duration, { high52, swingHigh10, ma20 });

  let score = 0;
  // Volume spike (−10 to +20) — Change 9 (Scoring Formula v2): flipped so 1-2x
  // (75% win rate, best zone) scores highest; 3x+ (50% win rate, -4.7% avg,
  // worst performer — late retail pile-in) is now penalized instead of rewarded.
  if (volRatio >= 3) score -= 10;
  else if (volRatio >= 2) score += 10;
  else if (volRatio >= 1) score += 20;
  else if (volRatio >= 0.5) score += 15;
  // else (<0.5x): 0 pts — too quiet for a reliable liquidity signal
  // Price momentum (0–20)
  if (todayChange >= 4) score += 20;
  else if (todayChange >= 2) score += 10;
  // RSI (−10 to +20) — Change 8 (Scoring Formula v2): buckets re-derived from
  // 28-trade analysis. RSI 65-75 no longer rewarded (0% win rate in data);
  // RSI 75+ now penalized. Does not affect the separate Mean Reversion signal below.
  if (rsi >= 55 && rsi <= 65) score += 20;
  else if (rsi >= 35 && rsi < 55) score += 15;
  else if (rsi < 35) score += 10;
  else if (rsi > 65 && rsi <= 75) score += 0;
  else if (rsi > 75) score -= 10;
  // Above 20-day MA
  if (price > ma20) score += 10;

  // News: compute hasNegNews for risk/display — no longer affects score
  let hasNegNews = false;
  if (newsItem) {
    const hl = (newsItem.headline || '').toLowerCase();
    hasNegNews = NEG_KEYWORDS.some(kw => hl.includes(kw));
  }

  // Volume Build: 2 consecutive days of rising volume + today >= 1.3x avg (0–15)
  // Change 10 (Scoring Formula v2): loosened from 3 to 2 consecutive days —
  // near-miss data showed 2-day setups had a 100% win rate vs 67% for actual
  // 3-day fires, suggesting the old threshold caught the setup one day late.
  let consRisingVolDays = 0;
  for (let i = vols.length - 1; i > 0; i--) {
    if (vols[i] > vols[i-1]) consRisingVolDays++;
    else break;
  }
  let volBuild = false;
  if (vols.length >= 2 && volRatio >= 1.3) {
    const n = vols.length;
    if (vols[n-1] > vols[n-2]) {
      volBuild = true;
      score += 15;
    }
  }
  const volBuildNearMiss = !volBuild ? { consecutiveDays: consRisingVolDays, volRatio } : null;

  // Mean Reversion: price 8–15% below 20MA, RSI < 45 and turning up (0–20)
  let meanReversion = false;
  const maPct = ma20 > 0 ? ((price - ma20) / ma20) * 100 : 0;
  if (maPct <= -8 && maPct >= -15 && rsi < 45 && closes.length >= 17) {
    const rsi2ago = calcRSI(closes.slice(0, -2));
    if (rsi > rsi2ago) {
      meanReversion = true;
      score += 20;
    }
  }
  const meanReversionNearMiss = !meanReversion ? { pctBelowMA: maPct, rsi } : null;

  // Consecutive up days (0–15 pts)
  let consUpDays = 0;
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i].c > sorted[i-1].c) consUpDays++;
    else break;
  }
  let consUpPts = 0;
  if (consUpDays >= 4) consUpPts = 15;
  else if (consUpDays === 3) consUpPts = 10;
  else if (consUpDays === 2) consUpPts = 5;
  score += consUpPts;

  // Relative strength vs SPY (0–15 pts)
  const rsVsSPY = todayChange - spyChangePct;
  let relStrengthPts = 0;
  if (rsVsSPY >= 2) relStrengthPts = 15;
  else if (rsVsSPY >= 1) relStrengthPts = 10;
  else if (rsVsSPY > 0) relStrengthPts = 5;
  score += relStrengthPts;

  const signalsFired = [];
  if (volBuild) signalsFired.push('VOL_BUILD');
  if (meanReversion) signalsFired.push('MEAN_REVERSION');
  if (consUpDays >= 3) signalsFired.push('CONS_UP');

  const volTrend = volBuild ? 'building' : volRatio >= 1.5 ? 'spike' : 'normal';

  // Normalize: raw score is a sum of independent per-signal points (see
  // RAW_SCORE_MAX), not already on a 0-100 scale. Since Scoring Formula v2,
  // score can go negative (RSI 75+, Volume 3x+ penalties) if no positive
  // signal offsets them — left unclamped here and allowed to normalize
  // proportionally; the macro-adjustment step below floors the final
  // result at 0, so nothing negative is ever actually displayed.
  score = Math.round((score / RAW_SCORE_MAX) * 100);

  // Macro Market Overlay (Step 3): category-specific adjustment applied on top
  // of the normalized 0-100 score above, which is otherwise untouched. Re-clamped
  // 0-100 per spec. macroCondition is null (adjustment 0) if macroContext hasn't
  // loaded yet or the fetch failed — never blocks scoring.
  const macroCondition = state.macroContext?.condition || null;
  const macroAdjustment = getMacroAdjustment(macroCondition, category);
  const macroChanges = state.macroContext?.changes || null;
  score = Math.max(0, Math.min(100, score + macroAdjustment));

  const risk = calcRiskScore(price, atr, rsi, volRatio, hasNegNews);
  const priceRange = price <= 3 ? '$1–$3' : price <= 9 ? '$4–$9' : '$10–$20';
  const signal = score >= 80 ? 'STRONG BUY' : score >= 50 ? 'SOFT BUY' : 'WATCH';

  return {
    ticker, company: COMPANY_NAMES[ticker] || ticker,
    price, prevClose, todayChange, volume, volRatio,
    rsi, atr, trimmedAtr, ma20, duration, entry, target, stop, cappedBy,
    score, risk, signal, priceRange, news: newsItem, hasNegNews,
    volBuild, meanReversion, maPct, volTrend, signalsFired,
    volBuildNearMiss, meanReversionNearMiss,
    consUpDays, consUpPts, spyChange: spyChangePct, rsVsSPY, relStrengthPts,
    macroCondition, macroAdjustment, macroChanges, category,
    bars: sorted
  };
}

// ── 10. SCREENER ──────────────────────────────────────────────────

async function runScreener() {
  if (!state.settings.alpacaKey || !state.settings.alpacaSecret) {
    renderNoKeys(); return;
  }
  if (state.loading) return;
  state.loading = true;
  setRefreshSpinning(true);
  renderSkeletons();

  try {
    // 0. Macro context — fetched once per session, cached on state.macroContext.
    // Failure is non-fatal: scoring/UI just treat a null macroContext as no adjustment.
    if (!state.macroContext) {
      try {
        state.macroContext = await fetchMacroContext();
      } catch(e) { console.warn('Macro context error', e.message); }
    }

    // 1. Batch snapshots
    const snapshots = await fetchSnapshots(TICKERS, updateScanProgress);
    checkUnresolvedSymbols(TICKERS, snapshots);

    // 2. Filter price + volume
    const minVol = state.settings.minVolume || 100000;
    const minPrice = state.settings.includeUnder2 ? 1 : 1;
    const candidates = Object.entries(snapshots).filter(([, snap]) => {
      const p = snap.dailyBar?.c || snap.latestTrade?.p || 0;
      const v = snap.dailyBar?.v || 0;
      return p >= minPrice && p <= 20 && v >= minVol;
    });

    state.lastPassedCount = candidates.length;
    persist('lastPassedCount');

    if (!candidates.length) {
      state.signals = []; state.lastScanTime = Date.now();
      persist('signals'); persist('lastScanTime');
      state.loading = false; setRefreshSpinning(false);
      renderSignalsTab(); return;
    }

    const ctickers = candidates.map(([t]) => t);

    // 3. Historical bars
    const allBars = await fetchMultiBars(ctickers, 100);

    // 4. News
    const newsItems = await fetchNewsForTickers(ctickers);
    const newsMap = {};
    newsItems.forEach(n => {
      (n.symbols || []).forEach(sym => {
        if (!newsMap[sym]) newsMap[sym] = n;
      });
    });

    // 5. SPY change for relative strength scoring
    let spyChangePct = 0;
    try {
      const spySnap = await fetchSnapshots(['SPY']);
      const spy = spySnap['SPY'];
      if (spy) {
        const spyP = spy.dailyBar?.c || spy.latestTrade?.p || 0;
        const spyPrev = spy.prevDailyBar?.c || spyP;
        spyChangePct = spyPrev > 0 ? ((spyP - spyPrev) / spyPrev) * 100 : 0;
      }
    } catch(e) {}
    state.spyChange = spyChangePct;

    // 6. Pre-market movers (if applicable)
    if (isPreMarketHours()) {
      await computePreMarketMovers(snapshots, candidates.slice(0, 20));
    }

    // 7. Score
    const category = state.selectedUniverse || 'BROAD';
    const scored = candidates.map(([ticker, snap]) => {
      const bars = allBars[ticker] || [];
      return scoreStock(ticker, snap, bars, newsMap[ticker] || null, spyChangePct, category);
    }).filter(s => s && s.score >= 20);

    // 7. Apply under-$2 filter
    const minP2 = state.settings.includeUnder2 ? 0 : 2;
    const final = scored.filter(s => s.price >= minP2);

    state.signals = final;

    state.signals.sort((a,b) => b.score - a.score);
    state.lastScanTime = Date.now();
    persist('signals'); persist('lastScanTime');
    state.news = newsItems;
    persist('news');

    // Fetch SIP snapshots for after-hours price data when market is in AH window
    if (isAfterHoursMode() && state.signals.length) {
      try {
        state.ahSnapshots = await fetchAHSnapshots(state.signals.map(s => s.ticker));
      } catch(e) {}
    }

  } catch(err) {
    console.error('Screener error:', err);
    state.loading = false; setRefreshSpinning(false);
    renderAlpacaError(err.message); return;
  }

  state.loading = false;
  setRefreshSpinning(false);
  renderSignalsTab();
  updateNavBadges();
}

async function computePreMarketMovers(snapshots, candidates) {
  const movers = candidates.map(([ticker, snap]) => {
    const prePrice = snap.minuteBar?.c || snap.latestTrade?.p || 0;
    const prevClose = snap.prevDailyBar?.c || 0;
    const pct = prevClose > 0 ? ((prePrice - prevClose) / prevClose) * 100 : 0;
    return { ticker, prePrice, pct };
  }).filter(m => m.prePrice > 0);

  movers.sort((a,b) => Math.abs(b.pct) - Math.abs(a.pct));
  state.preMarketMovers = movers.slice(0, 5);
}

function setRefreshSpinning(on) {
  const btn = document.getElementById('refresh-btn');
  if (btn) btn.classList.toggle('spinning', on);
}

function handleRefresh() {
  if (state.activeTab === 'signals') {
    const baseList = STOCK_UNIVERSES[state.selectedUniverse] || MASTER_TICKERS;
    TICKERS = baseList.length ? baseList : MASTER_TICKERS;
    runScreener();
  }
  else if (state.activeTab === 'portfolio') renderPortfolioTab();
}

// ── 11. SIGNALS TAB ───────────────────────────────────────────────

function renderSignalsTab() {
  const container = document.getElementById('tab-content');
  updateBudgetBar();

  if (!state.settings.alpacaKey) { renderNoKeys(); return; }

  const ms = getMarketStatus();
  const aft = isAfternoonMode();
  const title = aft ? 'AFTERNOON REVIEW' : 'MORNING SCAN';

  let html = `
    <div class="tab-header">
      <h1 class="tab-title">${title}</h1>
      <button class="btn btn-sm btn-primary" onclick="handleRefresh()">↻ Refresh</button>
    </div>
    ${getFreshnessHtml()}
    ${buildMacroBanner()}
  `;

  // Exit alerts (afternoon mode)
  if (aft && state.portfolio.length > 0) {
    const exitTickers = state.portfolio
      .filter(p => {
        const sig = state.signals.find(s => s.ticker === p.ticker);
        if (!sig) return false;
        return calcSellWarning(p, sig.price, sig.rsi, sig.atr) === 'SELL_NOW';
      })
      .map(p => p.ticker);
    if (exitTickers.length) {
      html += `<div class="exit-alerts-banner">🚨 EXIT ALERTS: ${exitTickers.join(', ')}</div>`;
    }
  }

  // Pre-market movers
  if (ms.status === 'PRE' && state.preMarketMovers?.length > 0) {
    html += renderPreMarketSection(state.preMarketMovers);
  }

  // Filters
  html += renderFilterButtons();

  if (!state.signals.length && !state.lastScanTime) {
    html += `<div class="empty-state">
      <div class="empty-icon">📊</div>
      <p>Tap Refresh to run your first scan.</p>
    </div>`;
  } else if (!state.signals.length) {
    html += `<div class="scan-summary">Market is quiet — no signals above threshold.</div>`;
    html += `<div class="empty-state">
      <div class="empty-icon">🔇</div>
      <p>Market is quiet right now. Try refreshing later.</p>
      <button class="btn btn-primary" onclick="runScreener()">↻ Refresh</button>
    </div>`;
  } else {
    // Exclude already-owned positions so the summary counts match the cards below.
    const unowned = state.signals.filter(s => !getOwnedPosition(s.ticker));
    const sb  = unowned.filter(s => s.signal === 'STRONG BUY').length;
    const sfb = unowned.filter(s => s.signal === 'SOFT BUY').length;
    const w   = unowned.filter(s => s.signal === 'WATCH').length;
    const total = TICKERS.length;
    const universe = state.selectedUniverse || 'BROAD';
    html += `<div class="scan-summary">Scanned ${total} stocks <span class="ss-universe">[${universe}]</span> — <span class="ss-strong">${sb} strong buy</span>, <span class="ss-soft">${sfb} soft buy</span>, <span class="ss-watch">${w} watch</span></div>`;

    const filtered = getFilteredSignals();
    if (!filtered.length) {
      html += `<div class="empty-state"><p>No signals match current filters.</p></div>`;
    } else {
      filtered.forEach(s => { html += renderStockCard(s, ms.status === 'CLOSED'); });
    }
  }

  container.innerHTML = html;
}

function renderPreMarketSection(movers) {
  let html = `<div class="premarket-section">
    <div class="premarket-title">⚡ PRE-MARKET MOVERS</div>`;
  movers.forEach(m => {
    const cls = m.pct >= 0 ? 'pos' : 'neg';
    const sign = m.pct >= 0 ? '▲' : '▼';
    html += `<div class="premarket-row">
      <strong class="mono">${m.ticker}</strong>
      <span class="mono ${cls}">$${m.prePrice.toFixed(2)} ${sign}${Math.abs(m.pct).toFixed(1)}%</span>
    </div>`;
  });
  html += `<div style="font-size:10px;color:var(--muted);margin-top:6px;">Pre-market — exercise caution, lower liquidity</div>`;
  html += `</div>`;
  return html;
}

function renderFilterButtons() {
  const pf = state.filters.priceRange;
  const df = state.filters.duration;
  const t  = state.signalToggles;
  const u  = state.selectedUniverse || 'BROAD';
  const universes = ['HEALTHCARE','ENERGY','TECH','RETAIL','FINANCIAL','INDUSTRIAL','BROAD'];
  return `
    <div class="filter-label">Universe</div>
    <div class="filter-row universe-row">
      ${universes.map(v =>
        `<button class="universe-btn ${u===v?'active':''}" onclick="setUniverse('${v}')">${v}</button>`
      ).join('')}
    </div>
    <div class="filter-row signal-toggle-row">
      <button class="signal-toggle signal-toggle-strong ${t.strongBuy?'active':''}" onclick="toggleSignal('strongBuy')">STRONG BUY</button>
      <button class="signal-toggle signal-toggle-soft ${t.softBuy?'active':''}" onclick="toggleSignal('softBuy')">SOFT BUY</button>
      <button class="signal-toggle signal-toggle-watch ${t.watch?'active':''}" onclick="toggleSignal('watch')">WATCH</button>
    </div>
    <div class="filter-label">Price Range</div>
    <div class="filter-row">
      ${['all','$1–$3','$4–$9','$10–$20'].map(v =>
        `<button class="filter-btn ${pf===v?'active':''}" onclick="setFilter('priceRange','${v}')">${v==='all'?'All':v}</button>`
      ).join('')}
    </div>
    <div class="filter-label">Trade Duration</div>
    <div class="filter-row">
      ${['all','DAY','3-DAY','WEEK'].map(v =>
        `<button class="filter-btn ${df===v?'active':''}" onclick="setFilter('duration','${v}')">${v==='all'?'All':v==='DAY'?'Exit Today':v==='3-DAY'?'2-4 Days':'5-7 Days'}</button>`
      ).join('')}
    </div>
  `;
}

function setFilter(key, val) {
  state.filters[key] = val;
  renderSignalsTab();
}

function setUniverse(name) {
  state.selectedUniverse = name;
  persist('selectedUniverse');
  const baseList = STOCK_UNIVERSES[name] || MASTER_TICKERS;
  TICKERS = baseList.length ? baseList : MASTER_TICKERS;
  runScreener();
}

function toggleSignal(category) {
  state.signalToggles[category] = !state.signalToggles[category];
  persist('signalToggles');
  renderSignalsTab();
}

function sigToggleKey(signal) {
  if (signal === 'STRONG BUY' || signal === 'BUY') return 'strongBuy';
  if (signal === 'SOFT BUY') return 'softBuy';
  return 'watch';
}

function getFilteredSignals() {
  return state.signals.filter(s => {
    // Already-owned positions don't belong in buy-signal results.
    if (getOwnedPosition(s.ticker)) return false;
    if (!state.signalToggles[sigToggleKey(s.signal)]) return false;
    const { priceRange, duration } = state.filters;
    if (priceRange !== 'all' && s.priceRange !== priceRange) return false;
    if (duration !== 'all' && s.duration !== duration) return false;
    return true;
  });
}

function renderSkeletons() {
  const container = document.getElementById('tab-content');
  let html = `
    <div class="tab-header"><h1 class="tab-title">SCANNING MARKET…</h1></div>
    <div class="scan-progress">
      <span id="scan-progress-text">Scanning… 0 / ${TICKERS.length.toLocaleString()} stocks</span>
      <div class="scan-progress-track"><div id="scan-progress-bar" class="scan-progress-bar" style="width:0%"></div></div>
    </div>
  `;
  for (let i = 0; i < 5; i++) html += `<div class="skel-card skeleton"></div>`;
  container.innerHTML = html;
}

function updateScanProgress(done, total) {
  const txt = document.getElementById('scan-progress-text');
  const bar = document.getElementById('scan-progress-bar');
  if (txt) txt.textContent = `Scanning… ${done.toLocaleString()} / ${total.toLocaleString()} stocks`;
  if (bar) bar.style.width = `${Math.round((done / total) * 100)}%`;
}

function renderNoKeys() {
  document.getElementById('tab-content').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🔑</div>
      <p>Welcome to EDGE.<br>Go to Settings to add your Alpaca and Groq API keys to get started.</p>
      <button class="btn btn-primary" onclick="switchTab('settings')">Open Settings</button>
    </div>`;
}

function renderAlpacaError(msg) {
  document.getElementById('tab-content').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⚠️</div>
      <p>Could not reach Alpaca. Check your API keys in Settings.</p>
      <p style="font-size:11px;color:var(--muted)">${msg}</p>
      <button class="btn btn-primary" onclick="switchTab('settings')">Open Settings</button>
    </div>`;
}

// ── 12. STOCK CARD ────────────────────────────────────────────────

function sigBadgeClass(signal) {
  if (signal === 'STRONG BUY' || signal === 'BUY') return 'badge-strong-buy';
  if (signal === 'SOFT BUY') return 'badge-soft-buy';
  return 'badge-watch';
}

function buildAHStrip(ticker) {
  if (!isAfterHoursMode()) return '';
  const ah = getAHData(ticker);
  if (!ah) return '';
  const { ahPrice, ahChangePct } = ah;
  const sign = ahChangePct >= 0 ? '+' : '';
  const cls  = ahChangePct >= 0 ? 'pos' : 'neg';
  const moverNote = Math.abs(ahChangePct) >= 2
    ? `<span class="ah-mover">${ahChangePct >= 0 ? '📈' : '📉'} Watch AM open</span>`
    : '';
  return `<div class="ah-strip">
    <span class="ah-label">After Hours</span>
    <span class="ah-price mono">$${ahPrice.toFixed(2)}</span>
    <span class="ah-change ${cls}">${sign}${ahChangePct.toFixed(2)}%</span>
    ${moverNote}
    <div class="ah-disclaimer">After hours — lower liquidity, wider spreads.</div>
  </div>`;
}

function renderStockCard(s, marketClosed) {
  const chgSign = s.todayChange >= 0 ? '▲' : '▼';
  const chgCls  = s.todayChange >= 0 ? 'change-pos' : 'change-neg';
  const upside  = ((s.target - s.price) / s.price * 100).toFixed(1);
  const riskCls = s.risk <= 3 ? 'risk-low' : s.risk <= 6 ? 'risk-mid' : 'risk-hi';
  const durBadge = durBadgeClass(s.duration);
  const sigBadge = sigBadgeClass(s.signal);
  const overlay      = marketClosed ? `<div class="closed-overlay">MARKET CLOSED</div>` : '';
  const ahStrip      = buildAHStrip(s.ticker);
  const actionBanner = buildSignalActionBanner(s);
  // Change 11: not marketClosed by construction whenever this is true (see
  // isDayTradeSuppressed comment), but guarded explicitly anyway so the two
  // overlays can never both render even if that invariant ever changes.
  const daySuppressed = !marketClosed && isDayTradeSuppressed(s.duration);
  const daySuppressedOverlay = daySuppressed
    ? `<div class="day-suppressed-overlay">⚠ Entry window closed — DAY trade signals expire at 10am</div>`
    : '';
  const hasExtraBadges = s.volBuild || s.meanReversion || (s.consUpDays >= 3);
  const sigBadges = hasExtraBadges ? `
    <div class="signal-extra-badges">
      ${s.volBuild                 ? '<span class="badge badge-vol-build">VOL BUILD</span>' : ''}
      ${s.meanReversion            ? '<span class="badge badge-reversal">REVERSAL</span>'  : ''}
      ${(s.consUpDays||0) >= 3     ? `<span class="badge badge-up-days">${s.consUpDays} UP DAYS</span>` : ''}
    </div>` : '';

  return `
    <div class="stock-card${daySuppressed ? ' stock-card-suppressed' : ''}" onclick="openStockModal('${s.ticker}')">
      ${overlay}
      ${daySuppressedOverlay}
      ${actionBanner}
      <div class="card-top">
        <div class="card-left">
          <span class="ticker-sym">${s.ticker}</span>
          <span class="price-mono">$${s.price.toFixed(2)}</span>
          <span class="${chgCls}">${chgSign}${Math.abs(s.todayChange).toFixed(1)}%</span>
        </div>
        <div class="card-right">
          <span class="badge ${sigBadge}">${s.signal} ${s.score}</span>
          <span class="badge ${durBadge}">${durBadgeText(s.duration)}</span>
        </div>
      </div>
      <div class="card-mid">
        <span class="company-name">${s.company}</span>
        <span class="risk-pill ${riskCls}">Risk: ${s.risk}/10</span>
        <span class="vol-chip">${s.volRatio.toFixed(1)}× vol</span>
      </div>
      ${sigBadges}
      <div class="card-divider"></div>
      <div class="card-levels">
        <span>Entry <span class="mono">$${s.entry.toFixed(2)}</span></span>
        <span>→</span>
        <span class="level-target">Target <span class="mono">$${s.target.toFixed(2)}</span> (▲${upside}%)</span>
      </div>
      ${s.cappedBy ? `<div class="target-capped-note">Target capped at ${s.cappedBy}</div>` : ''}
      <div class="card-sub">
        Stop <span class="mono">$${s.stop.toFixed(2)}</span> · RSI ${s.rsi.toFixed(0)} · ${s.priceRange}
      </div>
      ${buildCardNewsSnippet(s)}
      ${buildScoreBreakdown(s)}
      ${ahStrip}
    </div>`;
}

function buildSignalActionBanner(s) {
  const pt = getPT();
  const ptMin = pt.getHours() * 60 + pt.getMinutes();
  const isDay = s.duration === 'DAY';
  const tradingDay = isTradingDay(pt);

  // Change 11: once the 10am suppression overlay is active for a DAY trade,
  // don't also show these older MISSED/WINDOW CLOSING banners underneath it —
  // the grayed-out card + overlay already communicates "entry window closed,"
  // and the new threshold (10am) is always reached before either of these.
  if (isDay && isDayTradeSuppressed(s.duration)) return '';

  if (isDay && tradingDay && ptMin >= 720) {
    return `<div class="action-banner action-missed"><strong>MISSED — TOO LATE TODAY</strong></div>`;
  }
  if (isDay && tradingDay && ptMin >= 690) {
    return `<div class="action-banner action-window"><strong>WINDOW CLOSING</strong></div>`;
  }

  if (s.score < 50) return '';

  const allGreen = s.rsi >= 45 && s.rsi <= 72 && s.volRatio > 1.3 && s.price > s.ma20;
  if (allGreen) {
    return `<div class="action-banner action-buy-now"><strong>BUY NOW</strong> — All signals aligned</div>`;
  }

  let waitReason = '';
  if (s.rsi > 72) waitReason = `Wait for RSI to pull back below 70 (currently ${s.rsi.toFixed(0)})`;
  else if (s.volRatio <= 1.3) waitReason = `Wait for volume to exceed 1.3× avg (currently ${s.volRatio.toFixed(1)}×)`;
  else if (s.price <= s.ma20) waitReason = `Wait for price to reclaim 20-day MA`;

  return `<div class="action-banner action-wait"><strong>WAIT — WATCH FOR ENTRY</strong><span class="action-reason">${waitReason}</span></div>`;
}

// ── Card news + score breakdown helpers ──────────────────────────

function newsTimeAgo(news) {
  const ageH = (Date.now() - new Date(news.created_at).getTime()) / 3600000;
  if (ageH < 1) return `${Math.floor(ageH * 60)}m ago`;
  if (ageH < 24) return `${Math.floor(ageH)}h ago`;
  return `${Math.floor(ageH / 24)}d ago`;
}

function getNewsSentiment(hasNeg, createdAt) {
  if (hasNeg) return 'NEGATIVE';
  const ageH = (Date.now() - new Date(createdAt).getTime()) / 3600000;
  return ageH < 12 ? 'POSITIVE' : 'NEUTRAL';
}

function buildCardNewsSnippet(s) {
  if (!s.news) return `<div class="card-news-section"><span class="card-no-news">No recent news</span></div>`;
  const ageH = (Date.now() - new Date(s.news.created_at).getTime()) / 3600000;
  if (ageH > 24) return `<div class="card-news-section"><span class="card-no-news">No recent news</span></div>`;
  const ageStr = newsTimeAgo(s.news);
  const sentiment = getNewsSentiment(s.hasNegNews, s.news.created_at);
  const sentCls = sentiment === 'POSITIVE' ? 'sent-pos' : sentiment === 'NEGATIVE' ? 'sent-neg' : 'sent-neutral';
  const chgCls = s.todayChange >= 0 ? 'pos' : 'neg';
  const chgStr = `${s.todayChange >= 0 ? '+' : ''}${s.todayChange.toFixed(1)}% today`;
  const hl = (s.news.headline || '').substring(0, 85);
  const tail = (s.news.headline || '').length > 85 ? '…' : '';
  return `<div class="card-news-section">
    <div class="card-news-label">NEWS</div>
    <div class="card-news-headline">"${hl}${tail}"</div>
    <div class="card-news-meta">
      <span class="card-news-age">${ageStr}</span>
      <span class="news-sentiment ${sentCls}">${sentiment}</span>
      <span class="${chgCls}">${chgStr}</span>
    </div>
  </div>`;
}

function computeScoreBreakdown(s) {
  // Change 9 (Scoring Formula v2) — must mirror scoreStock()'s volume buckets exactly.
  let volPts = 0;
  let volNote = 'Too quiet — insufficient liquidity signal';
  if (s.volRatio >= 3) { volPts = -10; volNote = 'Volume spike — late entry risk'; }
  else if (s.volRatio >= 2) { volPts = 10; volNote = 'Elevated volume — moderate signal'; }
  else if (s.volRatio >= 1) { volPts = 20; volNote = 'Healthy volume — best win-rate zone'; }
  else if (s.volRatio >= 0.5) { volPts = 15; volNote = 'Quiet accumulation — strong historical performer'; }

  let momPts = 0;
  if (s.todayChange >= 4) momPts = 20;
  else if (s.todayChange >= 2) momPts = 10;

  // Change 8 (Scoring Formula v2) — must mirror scoreStock()'s RSI buckets exactly.
  let rsiPts = 0;
  let rsiNote = 'Overbought — caution';
  if (s.rsi >= 55 && s.rsi <= 65) { rsiPts = 20; rsiNote = 'Sweet spot — historically best win rate'; }
  else if (s.rsi >= 35 && s.rsi < 55) { rsiPts = 15; rsiNote = 'Neutral-bullish — solid performer'; }
  else if (s.rsi < 35) { rsiPts = 10; rsiNote = 'Oversold — potential bounce setup'; }
  else if (s.rsi > 65 && s.rsi <= 75) { rsiPts = 0; rsiNote = 'Elevated — no scoring bonus'; }
  else if (s.rsi > 75) { rsiPts = -10; rsiNote = 'Overbought — caution'; }

  const maPts      = s.price > s.ma20 ? 10 : 0;
  const volBuildPts = s.volBuild ? 15 : 0;
  const meanRevPts  = s.meanReversion ? 20 : 0;

  // Use pre-computed values from signal, fall back to recomputing
  const rsVsSPY       = s.rsVsSPY       ?? (s.todayChange - (s.spyChange || 0));
  const relStrPts     = s.relStrengthPts ?? (rsVsSPY >= 2 ? 15 : rsVsSPY >= 1 ? 10 : rsVsSPY > 0 ? 5 : 0);
  const consUpDays    = s.consUpDays     ?? 0;
  const consUpPts     = s.consUpPts      ?? (consUpDays >= 4 ? 15 : consUpDays === 3 ? 10 : consUpDays === 2 ? 5 : 0);

  const spySign = (s.spyChange || 0) >= 0 ? '+' : '';
  const rsSign  = rsVsSPY >= 0 ? '+' : '';

  const rows = [
    { key: 'vol',    short: 'vol',       label: `Volume (${s.volRatio.toFixed(1)}× avg) — ${volNote}`,                          pts: volPts,     fired: volPts > 0, neutral: volPts === 0 },
    { key: 'mom',    short: 'momentum',  label: `Price momentum (${s.todayChange>=0?'+':''}${s.todayChange.toFixed(1)}% today)`, pts: momPts,     fired: momPts > 0 },
    { key: 'rsi',    short: 'RSI',       label: `RSI position (${s.rsi.toFixed(0)}) — ${rsiNote}`,                              pts: rsiPts,     fired: rsiPts > 0, neutral: rsiPts === 0 },
    { key: 'ma',     short: 'MA',        label: `Above 20-day MA ($${s.ma20.toFixed(2)})`,                                      pts: maPts,      fired: maPts > 0 },
    { key: 'relstr', short: 'rel str',   label: `Relative strength (${rsSign}${rsVsSPY.toFixed(1)}% vs SPY ${spySign}${(s.spyChange||0).toFixed(1)}%)`, pts: relStrPts, fired: relStrPts > 0 },
    { key: 'consup', short: 'up days',   label: `Consecutive up days (${consUpDays} day${consUpDays !== 1 ? 's' : ''})`,        pts: consUpPts,  fired: consUpPts > 0 },
    { key: 'vbuild', short: 'vol build', label: `Volume build (2 days rising)`,                                                 pts: volBuildPts, fired: volBuildPts > 0 },
    { key: 'rev',    short: 'reversal',  label: `Mean reversion`,                                                               pts: meanRevPts, fired: meanRevPts > 0 },
  ];

  // Raw signal points above sum to at most RAW_SCORE_MAX (145), not 100 — score
  // is normalized (see scoreStock). Add an explicit reconciliation row so every
  // row's pts still sums to s.score instead of the breakdown silently not adding up.
  const rawTotal = rows.reduce((sum, r) => sum + r.pts, 0);
  const normalizedScore = Math.round((rawTotal / RAW_SCORE_MAX) * 100);
  rows.push({
    key: 'norm', short: 'normalized',
    label: `Normalized: raw ${rawTotal}/${RAW_SCORE_MAX} → ${normalizedScore}/100`,
    pts: normalizedScore - rawTotal,
    fired: false,
    neutral: normalizedScore === rawTotal,
  });

  // Macro Market Overlay (Step 4) — only shown once macroContext has actually
  // loaded (s.macroCondition truthy); omitted entirely otherwise rather than
  // faking a CHOPPY/0pt row for data that was never fetched.
  if (s.macroCondition) {
    const macroPts = s.macroAdjustment || 0;
    rows.push({
      key: 'macro', short: 'macro',
      label: `Market condition: ${s.macroCondition} (${formatMacroConditionDetail(s.macroCondition, s.macroChanges)})`,
      pts: macroPts,
      fired: macroPts > 0,
      neutral: macroPts === 0,
    });
  }

  return rows;
}

// Every row here fires at pts>=0 (never negative) except the Step 4 macro
// row, which can be negative (✗), zero-but-neutral/CHOPPY (—), or positive
// (✓). `neutral` is only set on rows where a 0-pt result should render as
// "—" instead of the default "✗" for not-fired.
function sbCheckIcon(r) {
  if (r.pts > 0) return { icon: '✓', cls: 'sb-chk-yes' };
  if (r.pts < 0) return { icon: '✗', cls: 'sb-chk-no' };
  return r.neutral ? { icon: '—', cls: 'sb-chk-neutral' } : { icon: '✗', cls: 'sb-chk-no' };
}

function buildScoreBreakdown(s) {
  const rows = computeScoreBreakdown(s);
  const id   = `sb-${s.ticker}`;

  const top2    = rows.filter(r => r.pts > 0).sort((a,b) => b.pts - a.pts).slice(0, 2);
  const preview = top2.length ? ' · ' + top2.map(r => `${r.short} +${r.pts}`).join(', ') : '';

  const rowsHtml = rows.map(r => {
    const ptsCls = r.pts > 0 ? 'sb-pos' : r.pts < 0 ? 'sb-neg' : 'sb-zero';
    const ptsStr = r.pts > 0 ? `+${r.pts}` : `${r.pts}`;
    const { icon, cls } = sbCheckIcon(r);
    return `<div class="sb-row">
      <span class="sb-check ${cls}">${icon}</span>
      <span class="sb-label">${r.label}</span>
      <span class="sb-pts ${ptsCls}">${ptsStr} pts</span>
    </div>`;
  }).join('');

  return `<div class="score-breakdown-wrap">
    <button class="sb-toggle" onclick="event.stopPropagation();toggleBreakdown('${id}')">
      SCORE BREAKDOWN — ${s.score} pts${preview} <span class="sb-arrow">▼</span>
    </button>
    <div class="sb-body hidden" id="${id}">${rowsHtml}</div>
  </div>`;
}

function buildModalScoreBreakdown(s) {
  const rows   = computeScoreBreakdown(s);
  const sigCls = s.signal === 'STRONG BUY' || s.signal === 'BUY' ? 'msb-strong'
               : s.signal === 'SOFT BUY' ? 'msb-soft' : 'msb-watch';

  const rowsHtml = rows.map(r => {
    const ptsCls = r.pts > 0 ? 'sb-pos' : r.pts < 0 ? 'sb-neg' : 'sb-zero';
    const ptsStr = r.pts > 0 ? `+${r.pts}` : r.pts === 0 ? '+0' : `${r.pts}`;
    const { icon, cls } = sbCheckIcon(r);
    return `<div class="sb-row msb-row">
      <span class="sb-check ${cls}">${icon}</span>
      <span class="sb-label msb-label">${r.label}</span>
      <span class="sb-pts ${ptsCls}">${ptsStr} pts</span>
    </div>`;
  }).join('');

  return `
    <div class="section-label">Score Breakdown</div>
    <div class="modal-score-breakdown">
      ${rowsHtml}
      <div class="msb-divider"></div>
      <div class="sb-row msb-row msb-total-row">
        <span class="sb-check" style="opacity:0">✓</span>
        <span class="sb-label msb-label msb-total-label">TOTAL</span>
        <span class="sb-pts sb-pos msb-total-pts">${s.score} pts</span>
      </div>
      <div class="sb-row msb-row">
        <span class="sb-check" style="opacity:0">✓</span>
        <span class="sb-label msb-label msb-total-label">SIGNAL</span>
        <span class="sb-pts ${sigCls} msb-total-pts">${s.signal}</span>
      </div>
    </div>`;
}

function toggleBreakdown(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const hidden = el.classList.toggle('hidden');
  const arrow = el.previousElementSibling?.querySelector('.sb-arrow');
  if (arrow) arrow.textContent = hidden ? '▼' : '▲';
}

function buildModalNewsSection(ticker) {
  const now = Date.now();
  const items = (state.news || [])
    .filter(n => (n.symbols || []).includes(ticker))
    .slice(0, 3);
  if (!items.length) return `<div class="section-label">Recent News</div><div class="card-no-news" style="padding:4px 0 8px">No recent news</div>`;
  const rowsHtml = items.map(n => {
    const ageH = (now - new Date(n.created_at).getTime()) / 3600000;
    const ageStr = ageH < 1 ? `${Math.floor(ageH*60)}m ago` : ageH < 24 ? `${Math.floor(ageH)}h ago` : `${Math.floor(ageH/24)}d ago`;
    const isNeg = NEG_KEYWORDS.some(kw => (n.headline||'').toLowerCase().includes(kw));
    const sentiment = getNewsSentiment(isNeg, n.created_at);
    const sentCls = sentiment === 'POSITIVE' ? 'sent-pos' : sentiment === 'NEGATIVE' ? 'sent-neg' : 'sent-neutral';
    return `<div class="modal-news-item">
      <div class="modal-news-headline">${n.headline||''}</div>
      <div class="modal-news-meta">
        <span class="card-news-age">${ageStr}</span>
        <span class="news-sentiment ${sentCls}">${sentiment}</span>
      </div>
    </div>`;
  }).join('');
  return `<div class="section-label">Recent News</div>${rowsHtml}`;
}

// ── 13. STOCK DETAIL MODAL ────────────────────────────────────────

let _priceChart = null;
let _chartBarsDaily   = [];
let _chartBarsHourly  = [];
let _chartCurrentPrice = 0;
let _modalStock = null;

async function openStockModal(ticker) {
  const s = state.signals.find(x => x.ticker === ticker);
  const ownedPos = getOwnedPosition(ticker);

  showModal(`<div class="modal-handle"></div>
    <div class="modal-header">
      <div>
        <div class="modal-title">${ticker}</div>
        <div style="font-size:12px;color:var(--muted)">${COMPANY_NAMES[ticker]||ticker}</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" id="stock-modal-body">
      <div class="ai-loading"><span class="spinner"></span> Loading chart data…</div>
    </div>
    <div class="modal-footer" id="stock-modal-footer"></div>
  `);

  try {
    const [bars, hourlyBars] = await Promise.all([fetchSingleBars(ticker, 300), fetchHourlyBars(ticker)]);
    const sorted = [...bars].sort((a,b) => new Date(a.t) - new Date(b.t));
    _chartBarsDaily  = sorted;
    _chartBarsHourly = [...hourlyBars].sort((a,b) => new Date(a.t) - new Date(b.t));
    const closes = sorted.map(b => b.c);
    const vols   = sorted.map(b => b.v);

    const price   = (s?.price) || sorted[sorted.length-1]?.c || 0;
    _chartCurrentPrice = price;
    const prevClose = closes.length >= 2 ? closes[closes.length-2] : price;
    const fallbackTodayChange = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;
    const rsi     = calcRSI(closes);
    const atr     = calcATR(sorted);
    const trimmedAtr = calcTrimmedATR(sorted);
    const ma20    = calcMA(closes, 20);
    const avgVol10 = calcAvgVolume(vols, 10);
    const volRatio = avgVol10 > 0 ? ((sorted[sorted.length-1]?.v||0) / avgVol10) : 1;

    const last252 = sorted.slice(-252);
    const high52  = last252.length ? Math.max(...last252.map(b => b.h)) : price;
    const low52   = last252.length ? Math.min(...last252.map(b => b.l)) : price;
    const last10ExclToday = sorted.slice(-11, -1);
    const swingHigh10 = last10ExclToday.length ? Math.max(...last10ExclToday.map(b => b.h)) : null;

    const stock = s || {
      ticker, company: COMPANY_NAMES[ticker]||ticker,
      price, rsi, atr, ma20, volRatio, bars: sorted,
      duration: classifyDuration(rsi, volRatio, closes),
      ...calcEntryTargetStop(price, trimmedAtr, classifyDuration(rsi, volRatio, closes), { high52, swingHigh10, ma20 }),
      score: 0, risk: calcRiskScore(price, atr, rsi, volRatio, false),
      priceRange: price <= 3 ? '$1–$3' : price <= 9 ? '$4–$9' : '$10–$20',
      todayChange: fallbackTodayChange, signal: 'WATCH', news: null
    };
    _modalStock = stock;
    // Genuinely live price/RSI from this modal's own fresh bar fetch — distinct from
    // stock.price/stock.rsi, which can be a stale state.signals cache entry when the
    // ticker is also in the current Signals scan. Used for owned-stock sell-warning calc.
    _modalStock.livePrice = sorted[sorted.length-1]?.c || price;
    _modalStock.liveRsi = rsi;

    // Always recompute new signal values from fresh bars
    let modalConsUpDays = 0;
    for (let i = sorted.length - 1; i > 0; i--) {
      if (sorted[i].c > sorted[i-1].c) modalConsUpDays++;
      else break;
    }
    const modalConsUpPts  = modalConsUpDays >= 4 ? 15 : modalConsUpDays === 3 ? 10 : modalConsUpDays === 2 ? 5 : 0;
    const modalSpyChg     = state.spyChange || 0;
    const modalRsVsSPY    = (stock.todayChange || 0) - modalSpyChg;
    const modalRelStrPts  = modalRsVsSPY >= 2 ? 15 : modalRsVsSPY >= 1 ? 10 : modalRsVsSPY > 0 ? 5 : 0;
    stock.consUpDays     = modalConsUpDays;
    stock.consUpPts      = modalConsUpPts;
    stock.spyChange      = modalSpyChg;
    stock.rsVsSPY        = modalRsVsSPY;
    stock.relStrengthPts = modalRelStrPts;

    const chgCls  = stock.todayChange >= 0 ? 'change-pos' : 'change-neg';
    const chgSign = stock.todayChange >= 0 ? '▲' : '▼';
    const sigBadge = sigBadgeClass(stock.signal);
    const riskCls  = stock.risk <= 3 ? 'risk-low' : stock.risk <= 6 ? 'risk-mid' : 'risk-hi';

    const rsiLabel = stock.rsi > 75 ? 'Overbought — caution'
      : stock.rsi < 35 ? 'Oversold bounce setup'
      : stock.rsi > 60 ? 'Bullish momentum'
      : 'Neutral';

    // When opened from Portfolio, Price Levels + duration reflect the actual position
    // (recorded at purchase), not a fresh recalculation — RSI/volume/score/chart still do.
    const displayEntry     = ownedPos ? ownedPos.buyPrice : stock.entry;
    const displayStop      = ownedPos ? ownedPos.stop     : stock.stop;
    const displayDuration  = ownedPos ? ownedPos.duration : stock.duration;
    const originalTarget   = ownedPos ? ownedPos.target   : stock.target;
    const originalCappedBy = ownedPos ? ownedPos.cappedByAtBuy : stock.cappedBy;
    const liveTarget       = stock.target; // already the fresh figure the Groq prompt uses
    const targetDriftPct   = ownedPos ? ((liveTarget - originalTarget) / originalTarget) * 100 : 0;
    const showLiveTarget   = ownedPos && Math.abs(targetDriftPct) > 5;
    const pnlDollar = ownedPos ? (price - ownedPos.buyPrice) * ownedPos.shares : null;
    const pnlPct    = ownedPos ? ((price - ownedPos.buyPrice) / ownedPos.buyPrice) * 100 : null;

    const durBadge = durBadgeClass(displayDuration);
    const durWhy = displayDuration === 'DAY'
      ? 'RSI elevated or volume spike detected — quick exit expected'
      : displayDuration === 'WEEK'
      ? 'RSI moderate with upward trend and steady volume — patient setup'
      : 'Moderate RSI with volume confirmation — medium-term swing';

    const upside = ((originalTarget - displayEntry) / displayEntry * 100).toFixed(1);
    const downside = ((displayStop - displayEntry) / displayEntry * 100).toFixed(1);

    // Change 11: Portfolio-tab positions (ownedPos truthy) are unaffected —
    // suppression only applies to Signals tab screener results.
    const daySuppressed = !ownedPos && isDayTradeSuppressed(displayDuration);
    const daySuppressedBanner = daySuppressed
      ? `<div class="day-suppressed-overlay" style="margin-bottom:12px">⚠ DAY trade — entry window has closed for today</div>`
      : '';

    document.getElementById('stock-modal-body').innerHTML = `
      ${daySuppressedBanner}
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
        <span class="price-mono" style="font-size:20px">$${price.toFixed(2)}</span>
        <span class="${chgCls}">${chgSign}${Math.abs(stock.todayChange).toFixed(1)}%</span>
        <span class="badge ${sigBadge}">${stock.signal} ${stock.score}</span>
        <span class="badge ${durBadge}">${durBadgeText(displayDuration)}</span>
        <span class="risk-pill ${riskCls}">Risk ${stock.risk}/10</span>
      </div>

      <div class="chart-range-btns">
        <button class="chart-range-btn active" data-range="3D" onclick="renderChartRange('3D')">3 Days</button>
        <button class="chart-range-btn" data-range="1M" onclick="renderChartRange('1M')">1 Month</button>
        <button class="chart-range-btn" data-range="YTD" onclick="renderChartRange('YTD')">YTD</button>
      </div>
      <div class="chart-wrap">
        <canvas id="price-chart"></canvas>
      </div>

      <div class="section-label">Price Levels</div>
      <div class="levels-grid">
        <div class="level-cell">
          <div class="level-cell-label">52-Week High</div>
          <div class="level-cell-val pos">$${high52.toFixed(2)}</div>
        </div>
        <div class="level-cell">
          <div class="level-cell-label">52-Week Low</div>
          <div class="level-cell-val neg">$${low52.toFixed(2)}</div>
        </div>
        <div class="level-cell">
          <div class="level-cell-label">Entry</div>
          <div class="level-cell-val">$${displayEntry.toFixed(2)}</div>
        </div>
        <div class="level-cell">
          <div class="level-cell-label">Target (▲${upside}%)</div>
          <div class="level-cell-val pos">$${originalTarget.toFixed(2)}</div>
          ${originalCappedBy ? `<div class="target-capped-note">Capped at ${originalCappedBy}</div>` : ''}
          ${showLiveTarget ? `<div class="target-capped-note">Live: $${liveTarget.toFixed(2)} ⚠ Shifted</div>` : ''}
        </div>
        <div class="level-cell">
          <div class="level-cell-label">Stop-Loss (${downside}%)</div>
          <div class="level-cell-val neg">$${displayStop.toFixed(2)}</div>
        </div>
        <div class="level-cell">
          <div class="level-cell-label">20-Day MA</div>
          <div class="level-cell-val">$${stock.ma20.toFixed(2)}</div>
        </div>
        ${ownedPos ? `
        <div class="level-cell">
          <div class="level-cell-label">Unrealized P&L</div>
          <div class="level-cell-val ${pnlDollar>=0?'pos':'neg'}">${pnlDollar>=0?'+':''}$${pnlDollar.toFixed(2)} (${pnlPct>=0?'+':''}${pnlPct.toFixed(1)}%)</div>
        </div>` : ''}
      </div>

      <div class="section-label">Signal Breakdown</div>
      <div class="signal-row">
        <span class="signal-key">RSI (14-day)</span>
        <span class="signal-val">${stock.rsi.toFixed(1)} — ${rsiLabel}</span>
      </div>
      <div class="signal-row">
        <span class="signal-key">Volume vs 10-day avg</span>
        <span class="signal-val">${stock.volRatio.toFixed(2)}×</span>
      </div>
      <div class="signal-row">
        <span class="signal-key">vs 20-day MA</span>
        <span class="signal-val">${stock.price > stock.ma20 ? '✓ Above' : '✗ Below'} ${stock.maPct != null ? '(' + (stock.maPct >= 0 ? '+' : '') + stock.maPct.toFixed(1) + '%)' : ''}</span>
      </div>
      <div class="signal-row">
        <span class="signal-key">Volume Trend</span>
        <span class="signal-val">${
          (stock.volTrend || 'normal') === 'building' ? '📈 Building (3 days)' :
          (stock.volTrend || 'normal') === 'spike'    ? '⚡ Spike (today only)' :
                                                         'Normal'
        }</span>
      </div>
      <div class="signal-row">
        <span class="signal-key">vs Market</span>
        <span class="signal-val">${modalRsVsSPY >= 0
          ? `Outperforming SPY by ${modalRsVsSPY.toFixed(1)}%`
          : `Underperforming SPY by ${Math.abs(modalRsVsSPY).toFixed(1)}%`}
          <span style="color:var(--muted);font-size:11px"> (SPY ${modalSpyChg>=0?'+':''}${modalSpyChg.toFixed(1)}%)</span>
        </span>
      </div>
      <div class="signal-row">
        <span class="signal-key">Price Trend</span>
        <span class="signal-val">${modalConsUpDays >= 2
          ? `Up ${modalConsUpDays} days in a row`
          : modalConsUpDays === 1 ? 'Up 1 day'
          : 'No consecutive up days'}</span>
      </div>
      ${stock.meanReversion ? `<div class="signal-row">
        <span class="signal-key">Mean Reversion</span>
        <span class="signal-val" style="color:var(--purple);font-size:11px;max-width:60%;text-align:right">Oversold bounce setup — price significantly below average and momentum turning up</span>
      </div>` : ''}
      <div class="signal-row">
        <span class="signal-key">Duration</span>
        <span class="signal-val">${durBadgeText(displayDuration)} — ${durWhy}</span>
      </div>
      <div style="font-size:10px;color:var(--muted);padding:2px 0 8px;line-height:1.4">
        Duration is an estimate based on historical volatility. Always follow sell warnings over duration labels.
      </div>
      <div class="signal-row">
        <span class="signal-key">Price Range</span>
        <span class="signal-val">${stock.priceRange}</span>
      </div>

      ${buildModalScoreBreakdown(stock)}

      <div class="modal-news-section">${buildModalNewsSection(ticker)}</div>

      <div class="ai-section" id="ai-section">
        <div class="ai-title">AI Analysis <span style="font-size:10px;color:var(--muted)">(Groq)</span></div>
        <button class="btn btn-sm btn-primary" onclick="loadAIAnalysis('${ticker}')">${ownedPos ? '📊 Should I Hold or Sell?' : '📊 Should I Buy Now?'}</button>
      </div>
    `;

    document.getElementById('stock-modal-footer').innerHTML = ownedPos ? `
      <button class="btn btn-ghost" style="flex:1" disabled>✓ In Portfolio</button>
      <button class="btn btn-ghost" onclick="closeModal()">✕</button>
    ` : daySuppressed ? `
      <button class="btn btn-ghost" style="flex:1" disabled title="Entry window closed for today">+ Add to Portfolio</button>
      <button class="btn btn-ghost" onclick="closeModal()">✕</button>
    ` : `
      <button class="btn btn-success" style="flex:1" onclick="openAddPortfolioModal('${ticker}')">+ Add to Portfolio</button>
      <button class="btn btn-ghost" onclick="closeModal()">✕</button>
    `;

    // Draw chart — default 3D
    renderChartRange('3D');

    // Restore AI if cached
    if (state.aiCache[ticker]) {
      renderAIResult(state.aiCache[ticker]);
    }

  } catch(err) {
    document.getElementById('stock-modal-body').innerHTML = `
      <div class="empty-state"><p>Failed to load data for ${ticker}.<br><small>${err.message}</small></p></div>`;
  }
}

function renderChartRange(range) {
  document.querySelectorAll('.chart-range-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === range);
  });

  let bars, isHourly = false;
  if (range === '3D') {
    if (_chartBarsHourly.length >= 6) {
      bars = _chartBarsHourly;
      isHourly = true;
    } else {
      bars = _chartBarsDaily.slice(-3);
    }
  } else if (range === '1M') {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
    bars = _chartBarsDaily.filter(b => new Date(b.t) >= cutoff);
  } else {
    const ytdStart = new Date(new Date().getFullYear(), 0, 1);
    bars = _chartBarsDaily.filter(b => new Date(b.t) >= ytdStart);
    if (!bars.length) bars = _chartBarsDaily.slice(-90);
  }

  renderPriceChart(bars, _chartCurrentPrice, isHourly);
}

function renderPriceChart(bars, currentPrice, isHourly = false) {
  const canvas = document.getElementById('price-chart');
  if (!canvas) return;
  if (_priceChart) { _priceChart.destroy(); _priceChart = null; }

  const labels = bars.map((b, i) => {
    const d = new Date(b.t);
    const prev = i > 0 ? new Date(bars[i-1].t) : null;
    if (isHourly) {
      return (!prev || d.getDate() !== prev.getDate())
        ? d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
    }
    return (!prev || d.getMonth() !== prev.getMonth())
      ? d.toLocaleDateString('en-US', { month: 'short' }) : '';
  });

  _priceChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: bars.map(b => b.c),
          borderColor: '#00b4d8',
          borderWidth: 2,
          fill: false,
          tension: 0.2,
          pointRadius: 0,
        },
        {
          data: bars.map(() => currentPrice),
          borderColor: '#ffd16680',
          borderWidth: 1,
          borderDash: [5,5],
          fill: false,
          pointRadius: 0,
          tension: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => `$${ctx.parsed.y.toFixed(2)}` }
        }
      },
      scales: {
        x: {
          grid: { color: '#1a2330' },
          ticks: { color: '#4a6070', maxRotation: 0,
            callback: (_, i) => labels[i] }
        },
        y: {
          grid: { color: '#1a2330' },
          ticks: { color: '#4a6070', callback: v => `$${v.toFixed(2)}` }
        }
      }
    }
  });
}

async function loadAIAnalysis(ticker) {
  const stock = _modalStock;
  if (!stock) return;
  const pos = getOwnedPosition(ticker);

  const sec = document.getElementById('ai-section');
  if (!sec) return;
  sec.innerHTML = `<div class="ai-title">AI Analysis</div><div class="ai-loading"><span class="spinner"></span> Analyzing with Groq…</div>`;

  try {
    const prompt = buildAIPrompt(stock, pos);
    const result = await groqAnalyze(ticker, prompt);
    renderAIResult(result);
  } catch(e) {
    console.error('Groq AI error:', e);
    sec.innerHTML = `<div class="ai-title">AI Analysis</div>
      <div class="ai-loading" style="color:var(--red)">AI unavailable — ${e.message}. Check Groq key in Settings.</div>`;
  }
}

function renderAIResult(result) {
  const sec = document.getElementById('ai-section');
  if (!sec) return;
  let html = `<div class="ai-title">AI Analysis <span style="font-size:10px;color:var(--muted)">(Groq)</span></div>`;
  result.answers.forEach(a => { html += `<div class="ai-bullet">• ${a}</div>`; });
  sec.innerHTML = html;
}

// ── 14. MODAL HELPERS ─────────────────────────────────────────────

function showModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  if (_priceChart) { _priceChart.destroy(); _priceChart = null; }
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function showConfirm(msg, cb) {
  document.getElementById('confirm-msg').textContent = msg;
  state._confirmCb = cb;
  document.getElementById('confirm-overlay').classList.remove('hidden');
}

function closeConfirm() {
  document.getElementById('confirm-overlay').classList.add('hidden');
  state._confirmCb = null;
}

function confirmAction() {
  if (state._confirmCb) state._confirmCb();
  closeConfirm();
}

// ── 15. PORTFOLIO TAB ──────────────────────────────────────────────

function openAddPortfolioModal(ticker) {
  const price = state.signals.find(s => s.ticker === ticker)?.price || 0;
  const today = new Date().toISOString().split('T')[0];

  showModal(`<div class="modal-handle"></div>
    <div class="modal-header">
      <div class="modal-title">Add ${ticker} to Portfolio</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Shares Purchased</label>
        <input id="pf-shares" class="form-input" type="number" min="0.01" step="0.01" placeholder="100">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Price Paid per Share</label>
          <input id="pf-price" class="form-input" type="number" step="0.01" value="${price.toFixed(2)}">
        </div>
        <div class="form-group">
          <label class="form-label">Date Purchased</label>
          <input id="pf-date" class="form-input" type="date" value="${today}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-success" style="flex:1" onclick="confirmAddPortfolio('${ticker}')">+ Add Position</button>
    </div>`);
}

function confirmAddPortfolio(ticker) {
  const shares = parseFloat(document.getElementById('pf-shares').value);
  const price  = parseFloat(document.getElementById('pf-price').value);
  const date   = document.getElementById('pf-date').value;

  if (!shares || !price || isNaN(shares) || isNaN(price)) {
    alert('Please enter shares and price.'); return;
  }

  const sig = state.signals.find(s => s.ticker === ticker);

  const position = {
    id: Date.now().toString(),
    ticker,
    company: COMPANY_NAMES[ticker] || ticker,
    shares, buyPrice: price, buyDate: date,
    target:   sig?.target || price * 1.10,
    stop:     sig?.stop   || price * 0.92,
    duration: sig?.duration || '3-DAY',
    scoreAtBuy:      sig?.score || 0,
    rsiAtBuy:        sig?.rsi   || 0,
    volRatioAtBuy:   sig?.volRatio || 0,
    riskAtBuy:       sig?.risk  || 5,
    newsAtBuy:       sig?.news?.headline || '',
    signalsFiredAtBuy: sig?.signalsFired || [],
    volBuildNearMiss:      sig?.volBuildNearMiss      || null,
    meanReversionNearMiss: sig?.meanReversionNearMiss || null,
    cappedByAtBuy: sig?.cappedBy || null,
    rawAtrAtBuy:     sig?.atr        ?? null,
    trimmedAtrAtBuy: sig?.trimmedAtr ?? null,
    macroConditionAtBuy: sig?.macroCondition || null,
    peakPrice:   price,
    peakPriceDate: date,
    momentumProtectionActivated: false,
    rsiSuspendedAtGainPct: null,
  };

  state.portfolio.push(position);
  persist('portfolio');
  closeModal();
  updateNavBadges();
  switchTab('portfolio');
}

async function renderPortfolioTab() {
  const container = document.getElementById('tab-content');
  updateBudgetBar();
  const aft = isAfternoonMode();

  if (!state.portfolio.length) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-icon">💼</div>
      <p>No open positions yet.<br>Find a signal and tap "+ Add to Portfolio".</p>
    </div>`;
    return;
  }

  const weekendBanner = buildWeekendBanner();
  container.innerHTML = `<div class="tab-header">
    <h1 class="tab-title">PORTFOLIO</h1>
    <button class="btn btn-sm btn-ghost" onclick="renderPortfolioTab()">↻</button>
  </div>
  ${weekendBanner}
  <div id="pf-list"><div class="empty-state"><span class="spinner"></span></div></div>
  <div id="pf-summary"></div>`;

  // Fetch live prices
  const tickers = state.portfolio.map(p => p.ticker);
  let snapshots = {};
  let allBars   = {};
  let pfAHSnaps = {};
  try {
    if (state.settings.alpacaKey) {
      const fetches = [fetchSnapshots(tickers), fetchMultiBars(tickers, 100)];
      if (isAfterHoursMode()) fetches.push(fetchAHSnapshots(tickers));
      const results = await Promise.all(fetches);
      [snapshots, allBars] = results;
      if (isAfterHoursMode()) pfAHSnaps = results[2] || {};
    }
  } catch(e) {}

  let totalCost = 0, totalValue = 0;
  let html = '';

  state.portfolio.forEach(p => {
    const snap = snapshots[p.ticker];
    const bars = (allBars[p.ticker] || []).sort((a,b) => new Date(a.t)-new Date(b.t));
    const closes = bars.map(b => b.c);

    const currentPrice = snap?.dailyBar?.c || snap?.latestTrade?.p || p.buyPrice;
    const rsi = closes.length >= 15 ? calcRSI(closes) : p.rsiAtBuy;
    const trimmedAtr = bars.length >= 15 ? calcTrimmedATR(bars) : 0;

    // Live recalculated target (display-only — sell warnings keep using p.target)
    const liveTarget = trimmedAtr > 0 ? calcEntryTargetStop(currentPrice, trimmedAtr, p.duration).target : null;
    p.liveTarget = liveTarget;

    // Update peak + Momentum Protection state (Rule 1). Activation is sticky —
    // once true it never reverts, even if price later pulls back under +20%,
    // so RSI/target suspension (Rule 2) doesn't flicker on and off.
    if (currentPrice > (p.peakPrice || 0)) {
      p.peakPrice = currentPrice;
      p.peakPriceDate = new Date().toISOString().split('T')[0];
      persist('portfolio');
    }
    if (!p.momentumProtectionActivated && p.peakPrice >= p.buyPrice * 1.20) {
      p.momentumProtectionActivated = true;
      persist('portfolio');
    }
    // Rule 5 support: first time RSI hits the (soon-to-be-suspended) 72+ threshold
    // while protected, snapshot the gain% at that instant — sticky, never overwritten —
    // so the report can later show what an RSI-based exit would have left on the table.
    if (p.momentumProtectionActivated && p.rsiSuspendedAtGainPct == null && rsi >= 72) {
      p.rsiSuspendedAtGainPct = ((currentPrice - p.buyPrice) / p.buyPrice) * 100;
      persist('portfolio');
    }

    state.portfolioPrices[p.ticker] = currentPrice;

    const cost  = p.shares * p.buyPrice;
    const value = p.shares * currentPrice;
    totalCost  += cost;
    totalValue += value;

    const pnlDollar = value - cost;
    const pnlPct    = ((currentPrice - p.buyPrice) / p.buyPrice * 100);
    const pnlCls    = pnlDollar >= 0 ? 'pos' : 'neg';
    const cardCls   = Math.abs(pnlPct) < 1 ? 'breakeven' : pnlDollar >= 0 ? 'in-profit' : 'in-loss';

    const days = Math.floor((Date.now() - new Date(p.buyDate).getTime()) / 86400000);
    const durLabel = durHoldLabel(p.duration);
    const durBadge = durBadgeClass(p.duration);

    const portBanner   = buildPortfolioBanner(p, currentPrice, rsi, pnlDollar, pnlPct, days);
    const fridayFlag   = buildFridayFlag(p, currentPrice, pnlPct);
    const priceDiffPct = ((currentPrice - p.buyPrice) / p.buyPrice) * 100;
    const priceTrackCls = Math.abs(priceDiffPct) < 1 ? 'pf-track-flat' : priceDiffPct > 0 ? 'pf-track-up' : 'pf-track-down';

    const targetDriftPct = liveTarget ? ((liveTarget - p.target) / p.target) * 100 : 0;
    const targetDisplay = (liveTarget && Math.abs(targetDriftPct) > 5)
      ? `Original target: $${p.target.toFixed(2)} → Live target: $${liveTarget.toFixed(2)} <span class="pf-shifted">⚠ Shifted</span>`
      : `Target $${p.target.toFixed(2)}`;

    // Rule 4: trailing stop recalculated from peakPrice every refresh, same threshold
    // as the SELL_SOON trailing check in getPortfolioTier/calcSellWarning.
    const momentumBadge = p.momentumProtectionActivated
      ? `<div class="pf-momentum">🚀 Momentum Protection active — trailing stop $${(p.peakPrice * 0.85).toFixed(2)}</div>`
      : '';

    // Build AH row for portfolio card
    let pfAHHtml = '';
    if (isAfterHoursMode()) {
      const ahSnap = pfAHSnaps[p.ticker];
      const ahPrice = ahSnap?.latestTrade?.p;
      const regClose = ahSnap?.dailyBar?.c || currentPrice;
      if (ahPrice && ahPrice !== regClose) {
        const ahChg = ((ahPrice - regClose) / regClose) * 100;
        const ahSign = ahChg >= 0 ? '+' : '';
        const ahCls  = ahChg >= 0 ? 'pos' : 'neg';
        const moverTag = Math.abs(ahChg) >= 2
          ? `<span class="ah-mover">${ahChg >= 0 ? '📈' : '📉'} Watch AM</span>` : '';
        pfAHHtml = `<div class="pf-ah-row">
          <span class="ah-label">After Hours</span>
          <span class="mono" style="color:var(--yellow)">$${ahPrice.toFixed(2)}</span>
          <span class="ah-change ${ahCls}">${ahSign}${ahChg.toFixed(2)}%</span>
          ${moverTag}
          <div class="ah-disclaimer">After hours — lower liquidity, wider spreads.</div>
        </div>`;
      }
    }

    html += `<div class="portfolio-card ${cardCls}">
      ${portBanner}
      ${fridayFlag}
      <div class="pf-top">
        <div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="ticker-sym">${p.ticker}</span>
            <span class="badge ${durBadge}">${durBadgeText(p.duration)}</span>
          </div>
          <div class="company-name mt4">${p.company}</div>
          <div class="pf-meta">${p.shares} shares · Day ${days+1} of ${durLabel} trade (est.)</div>
          <div class="pf-meta">Bought ${p.buyDate}</div>
        </div>
        <div style="text-align:right">
          <div class="pf-pnl ${pnlCls}" style="font-size:15px">${pnlDollar>=0?'+':''}$${pnlDollar.toFixed(2)}</div>
          <div class="pf-pnl ${pnlCls}" style="font-size:13px">${pnlDollar>=0?'▲':'▼'}${Math.abs(pnlPct).toFixed(1)}%</div>
        </div>
      </div>
      <div class="pf-price-track ${priceTrackCls}">
        Bought: $${p.buyPrice.toFixed(2)} → Now: $${currentPrice.toFixed(2)}
      </div>
      ${pfAHHtml}
      ${momentumBadge}
      <div class="card-sub">
        ${targetDisplay} · Stop $${p.stop.toFixed(2)} · RSI ${rsi.toFixed(0)}
      </div>
      <div class="pf-actions">
        <button class="btn btn-danger btn-sm" onclick="openMarkSoldModal('${p.id}', ${currentPrice})">Mark as Sold</button>
        <button class="btn btn-ghost btn-sm" onclick="openStockModal('${p.ticker}')">View Signal</button>
      </div>
    </div>`;
  });

  const totalPnL    = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost * 100) : 0;
  const allTimePnL  = state.sold.reduce((sum, s) => sum + s.pnlDollar, 0);

  const sumHtml = `<div class="pf-summary">
    <div class="section-label">Portfolio Summary</div>
    <div class="pf-summary-row"><span>Total Value</span><span class="mono">$${totalValue.toFixed(2)}</span></div>
    <div class="pf-summary-row"><span>Unrealized P&L</span><span class="mono ${totalPnL>=0?'pos':'neg'}">${totalPnL>=0?'+':''}$${totalPnL.toFixed(2)} (${totalPnLPct.toFixed(1)}%)</span></div>
    <div class="pf-summary-row"><span>All-Time Realized P&L</span><span class="mono ${allTimePnL>=0?'pos':'neg'}">${allTimePnL>=0?'+':''}$${allTimePnL.toFixed(2)}</span></div>
  </div>`;

  const listEl = document.getElementById('pf-list');
  const sumEl  = document.getElementById('pf-summary');
  if (listEl) listEl.innerHTML = html;
  if (sumEl)  sumEl.innerHTML  = sumHtml;
}

function calcSellWarning(position, currentPrice, rsi, atr) {
  const pnlPct = ((currentPrice - position.buyPrice) / position.buyPrice) * 100;
  const pt = getPT();
  const ptMin = pt.getHours() * 60 + pt.getMinutes();
  const days = Math.floor((Date.now() - new Date(position.buyDate).getTime()) / 86400000);
  // Momentum Protection (Rule 2): once a position has ever run 20%+ above purchase,
  // RSI-based warnings are suspended for good — see momentumProtectionActivated in
  // renderPortfolioTab. Stop-loss, -8% loss, and day-trade cutoff stay active regardless.
  const inProtection = !!position.momentumProtectionActivated;

  // SELL NOW conditions
  if (currentPrice <= position.stop) return 'SELL_NOW';
  if (!inProtection && rsi > 78) return 'SELL_NOW';
  if (pnlPct <= -8) return 'SELL_NOW';
  if (position.duration === 'DAY' && ptMin >= 720 && isTradingDay(pt)) return 'SELL_NOW'; // past 12pm
  // More than 10% past original target — take the profit, regardless of other conditions.
  // Suspended while protected (Rule 3) — the trailing stop below governs instead.
  if (!inProtection && currentPrice > position.target * 1.10) return 'SELL_NOW';
  // Trailing stop (Rule 3): dropped 20%+ from peak while protected
  if (inProtection && currentPrice <= position.peakPrice * 0.80) return 'SELL_NOW';

  // SELL SOON conditions
  // Note: target*1.05 (more than 5% past target) is already covered by the 0.97
  // threshold below — any price above 105% of target is also above 97% of it.
  // Suspended while protected (Rule 3).
  if (!inProtection) {
    const toTarget = currentPrice >= position.target * 0.97;
    if (toTarget) return 'SELL_SOON';
  }
  if (!inProtection && rsi >= 72) return 'SELL_SOON';
  if (position.duration === '3-DAY' && days >= 4) return 'SELL_SOON';
  if (position.duration === 'WEEK' && days >= 7) return 'SELL_SOON';

  // Peak give-back (more than half of peak gain given back). Superseded by the
  // Rule 3 trailing stop once Momentum Protection is active (per confirmed scope).
  const peakGain = position.peakPrice - position.buyPrice;
  if (!inProtection && peakGain > 0) {
    const currentGain = currentPrice - position.buyPrice;
    if (currentGain < peakGain * 0.5) return 'SELL_SOON';
  }

  // Trailing stop (Rule 3): dropped 15%+ from peak while protected
  if (inProtection && currentPrice <= position.peakPrice * 0.85) return 'SELL_SOON';

  return 'HOLDING';
}

function getSellNowReason(p, price, rsi) {
  if (price <= p.stop) return 'Price hit stop-loss';
  if (rsi > 78) return `RSI ${rsi.toFixed(0)} — extremely overbought`;
  const pt = getPT();
  if (p.duration === 'DAY' && pt.getHours() >= 12) return 'Day trade — exit before close';
  return 'Down 8%+ from purchase';
}

function getSellSoonReason(p, price, rsi, days) {
  const toTarget = price >= p.target * 0.97;
  if (toTarget) return 'Within 3% of target — protect gains';
  if (rsi >= 72) return `RSI ${rsi.toFixed(0)} approaching overbought`;
  if (p.duration === '3-DAY' && days >= 4) return '4+ days — est. 2-4 day trade overdue';
  if (p.duration === 'WEEK' && days >= 7) return '7+ days — est. 5-7 day trade complete';
  return 'Peak gain giving back';
}

function buildWeekendBanner() {
  const pt = getPT();
  if (pt.getDay() !== 5 || !isTradingDay(pt)) return '';
  const ptMin = pt.getHours() * 60 + pt.getMinutes();
  if (ptMin < 660) return ''; // before 11:00am PT
  const minsToClose = 780 - ptMin; // market closes at 1:00pm PT (780 min)
  const timeStr = minsToClose > 0
    ? `${(minsToClose / 60).toFixed(1)} hours`
    : 'soon';
  return `<div class="weekend-banner">⚠️ WEEKEND RISK — Market closes in ${timeStr}. Consider taking profits on winning positions before close to avoid weekend exposure.</div>`;
}

function buildFridayFlag(p, currentPrice, pnlPct) {
  const pt = getPT();
  if (pt.getDay() !== 5 || !isTradingDay(pt)) return '';
  const ptMin = pt.getHours() * 60 + pt.getMinutes();
  if (ptMin < 660) return ''; // before 11:00am PT

  if (p.duration === 'DAY') {
    return `<div class="friday-flag friday-urgent">📅 EXIT TODAY — do not hold over weekend</div>`;
  }

  const distToStop = ((currentPrice - p.stop) / currentPrice) * 100;
  if (currentPrice <= p.stop || distToStop <= 3 || pnlPct <= -8) {
    return `<div class="friday-flag friday-urgent">📅 Friday — strongly consider exiting before weekend</div>`;
  }

  if (pnlPct >= 0) {
    return `<div class="friday-flag">📅 Friday — consider taking profits before close</div>`;
  }

  return `<div class="friday-flag">📅 Friday — are you comfortable holding this risk over the weekend?</div>`;
}

// Single source of truth for the Portfolio card's hold/sell tier — also used by
// the Groq "owned stock" prompt so the two can never disagree with each other.
function getPortfolioTier(p, currentPrice, rsi, pnlDollar, pnlPct, days) {
  const pt = getPT();
  const ptMin = pt.getHours() * 60 + pt.getMinutes();
  // Momentum Protection (Rule 2): once a position has ever run 20%+ above purchase,
  // RSI-based warnings are suspended for good — see momentumProtectionActivated in
  // renderPortfolioTab. Stop-loss, -8% loss, and day-trade cutoff stay active regardless.
  const inProtection = !!p.momentumProtectionActivated;

  // SELL NOW
  if (currentPrice <= p.stop) return 'SELL_NOW';
  if (!inProtection && rsi > 78) return 'SELL_NOW';
  if (pnlPct <= -8) return 'SELL_NOW';
  if (p.duration === 'DAY' && ptMin >= 720 && isTradingDay(pt)) return 'SELL_NOW';
  // More than 10% past original target — take the profit, regardless of other conditions.
  // Suspended while protected (Rule 3) — the trailing stop below governs instead.
  if (!inProtection && currentPrice > p.target * 1.10) return 'SELL_NOW';
  // Trailing stop (Rule 3): dropped 20%+ from peak while protected
  if (inProtection && currentPrice <= p.peakPrice * 0.80) return 'SELL_NOW';

  // DANGER — within 3% of stop-loss
  const distToStop = ((currentPrice - p.stop) / currentPrice) * 100;
  if (distToStop > 0 && distToStop <= 3) return 'DANGER';

  // SELL SOON — more than 5% past original target, regardless of other conditions.
  // Suspended while protected (Rule 3).
  if (!inProtection && currentPrice > p.target * 1.05) return 'SELL_SOON';

  // SELL SOON — within 5% of target (approaching from below). Suspended while protected.
  if (!inProtection) {
    const distToTarget = ((p.target - currentPrice) / p.target) * 100;
    if (distToTarget >= 0 && distToTarget <= 5) return 'SELL_SOON';
  }

  // Trailing stop (Rule 3): dropped 15%+ from peak while protected
  if (inProtection && currentPrice <= p.peakPrice * 0.85) return 'SELL_SOON';

  // HOLD ON TRACK (profitable)
  if (pnlDollar >= 0) return 'HOLD_TRACK';

  // HOLD RECOVERING (negative but not at stop)
  return 'HOLD_RECOVER';
}

function buildPortfolioBanner(p, currentPrice, rsi, pnlDollar, pnlPct, days) {
  const tier = getPortfolioTier(p, currentPrice, rsi, pnlDollar, pnlPct, days);
  const distToStop = ((currentPrice - p.stop) / currentPrice) * 100;
  const distToTarget = ((p.target - currentPrice) / p.target) * 100;
  // Must mirror getPortfolioTier's inProtection gating exactly, or this reason-text
  // selection can misattribute a SELL_NOW to RSI when RSI is no longer what's driving it.
  const inProtection = !!p.momentumProtectionActivated;

  if (tier === 'SELL_NOW') {
    if (currentPrice <= p.stop)
      return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — Price hit stop-loss</div>`;
    if (!inProtection && rsi > 78)
      return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — RSI ${rsi.toFixed(0)} — extremely overbought</div>`;
    if (pnlPct <= -8)
      return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — Down 8%+ from purchase</div>`;
    if (!inProtection && currentPrice > p.target * 1.10)
      return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — ${(-distToTarget).toFixed(1)}% past target $${p.target.toFixed(2)} — take the profit</div>`;
    if (inProtection && currentPrice <= p.peakPrice * 0.80) {
      const dropPct = ((p.peakPrice - currentPrice) / p.peakPrice) * 100;
      return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — Dropped ${dropPct.toFixed(1)}% from peak $${p.peakPrice.toFixed(2)} — trailing stop hit</div>`;
    }
    return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — Day trade — exit before close</div>`;
  }

  if (tier === 'DANGER')
    return `<div class="port-banner port-danger"><strong>⚠️ DANGER — NEAR STOP-LOSS</strong> — Stop-loss at $${p.stop.toFixed(2)} — price is ${distToStop.toFixed(1)}% away. Consider exiting.</div>`;

  if (tier === 'SELL_SOON') {
    if (inProtection && currentPrice <= p.peakPrice * 0.85) {
      const dropPct = ((p.peakPrice - currentPrice) / p.peakPrice) * 100;
      return `<div class="port-banner port-sell-soon"><strong>🟠 SELL SOON — TAKE PROFITS</strong> — Dropped ${dropPct.toFixed(1)}% from peak $${p.peakPrice.toFixed(2)} — trailing stop</div>`;
    }
    if (!inProtection && currentPrice > p.target)
      return `<div class="port-banner port-sell-soon"><strong>🟠 SELL SOON — TAKE PROFITS</strong> — ${(-distToTarget).toFixed(1)}% past target $${p.target.toFixed(2)} — exceeded goal</div>`;
    return `<div class="port-banner port-sell-soon"><strong>🟠 SELL SOON — TAKE PROFITS</strong> — Target $${p.target.toFixed(2)} — you are ${distToTarget.toFixed(1)}% away</div>`;
  }

  if (tier === 'HOLD_TRACK')
    return `<div class="port-banner port-hold-track"><strong>✅ HOLD — ON TRACK</strong> — Up $${pnlDollar.toFixed(2)} (+${pnlPct.toFixed(1)}%) — holding strong</div>`;

  return `<div class="port-banner port-hold-recover"><strong>🟡 HOLD — RECOVERING</strong> — Down $${Math.abs(pnlDollar).toFixed(2)} (-${Math.abs(pnlPct).toFixed(1)}%) — stop-loss at $${p.stop.toFixed(2)}</div>`;
}

// ── 17. MARK AS SOLD ──────────────────────────────────────────────

function openMarkSoldModal(posId, currentPrice) {
  const today = new Date().toISOString().split('T')[0];
  showModal(`<div class="modal-handle"></div>
    <div class="modal-header">
      <div class="modal-title">Mark as Sold</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Sale Price per Share</label>
          <input id="sold-price" class="form-input" type="number" step="0.01" value="${currentPrice.toFixed(2)}">
        </div>
        <div class="form-group">
          <label class="form-label">Date Sold</label>
          <input id="sold-date" class="form-input" type="date" value="${today}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Why did you sell?</label>
        <div class="decision-btns">
          <div class="decision-btn selected" id="dec-app" onclick="selectDecision('app')">App Signal</div>
          <div class="decision-btn" id="dec-own" onclick="selectDecision('own')">My Own Call</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" style="flex:1" onclick="confirmMarkSold('${posId}')">Confirm Sale</button>
    </div>`);

  window._saleDecision = 'app';
}

function selectDecision(dec) {
  window._saleDecision = dec;
  document.getElementById('dec-app').classList.toggle('selected', dec === 'app');
  document.getElementById('dec-own').classList.toggle('selected', dec === 'own');
}

function confirmMarkSold(posId) {
  const salePrice = parseFloat(document.getElementById('sold-price').value);
  const saleDate  = document.getElementById('sold-date').value;
  if (!salePrice || isNaN(salePrice)) { alert('Enter sale price.'); return; }

  const pos = state.portfolio.find(p => p.id === posId);
  if (!pos) { closeModal(); return; }

  const days = Math.floor((new Date(saleDate) - new Date(pos.buyDate)) / 86400000);
  const pnlDollar = (salePrice - pos.buyPrice) * pos.shares;
  const pnlPct    = ((salePrice - pos.buyPrice) / pos.buyPrice) * 100;
  const currentWarn = calcSellWarning(pos, salePrice, pos.rsiAtBuy, 0);
  const targetDriftPct = (pos.liveTarget != null && pos.target)
    ? ((pos.liveTarget - pos.target) / pos.target) * 100
    : null;
  // Rule 5: did the position actually exit via the trailing stop threshold?
  const trailingStopTriggered = !!pos.momentumProtectionActivated && salePrice <= pos.peakPrice * 0.85;

  const record = {
    id: Date.now().toString(),
    ticker: pos.ticker,
    company: pos.company,
    shares: pos.shares,
    buyPrice: pos.buyPrice,
    sellPrice: salePrice,
    buyDate: pos.buyDate,
    sellDate: saleDate,
    daysHeld: days,
    pnlDollar, pnlPct,
    source: window._saleDecision === 'app' ? 'App Signal' : 'Own Decision',
    scoreAtBuy: pos.scoreAtBuy,
    rsiAtBuy: pos.rsiAtBuy,
    volRatioAtBuy: pos.volRatioAtBuy,
    riskAtBuy: pos.riskAtBuy,
    newsAtBuy: pos.newsAtBuy,
    signalsFiredAtBuy: pos.signalsFiredAtBuy || [],
    volBuildNearMiss:      pos.volBuildNearMiss      || null,
    meanReversionNearMiss: pos.meanReversionNearMiss || null,
    cappedByAtBuy: pos.cappedByAtBuy || null,
    rawAtrAtBuy:     pos.rawAtrAtBuy     ?? null,
    trimmedAtrAtBuy: pos.trimmedAtrAtBuy ?? null,
    macroConditionAtBuy: pos.macroConditionAtBuy || null,
    duration: pos.duration,
    priceRange: salePrice <= 3 ? '$1–$3' : salePrice <= 9 ? '$4–$9' : '$10–$20',
    sellWarningAtSale: currentWarn,
    targetDriftPct,
    peakPrice: pos.peakPrice,
    peakPriceDate: pos.peakPriceDate || null,
    momentumProtectionActivated: !!pos.momentumProtectionActivated,
    trailingStopTriggered,
    rsiSuspendedAtGainPct: pos.rsiSuspendedAtGainPct ?? null,
  };

  state.sold.unshift(record);
  state.portfolio = state.portfolio.filter(p => p.id !== posId);
  persist('sold');
  persist('portfolio');
  closeModal();
  updateNavBadges();
  renderPortfolioTab();
}

// ── 18. SOLD TAB ──────────────────────────────────────────────────

async function renderSoldTab() {
  const container = document.getElementById('tab-content');

  if (!state.sold.length) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-icon">✅</div>
      <p>No completed trades yet. Your sold positions will appear here with performance analysis.</p>
    </div>`;
    return;
  }

  const wins = state.sold.filter(s => s.pnlPct > 0);
  const losses = state.sold.filter(s => s.pnlPct <= 0);
  const winRate = state.sold.length ? (wins.length / state.sold.length * 100).toFixed(0) : 0;
  const totalPnL = state.sold.reduce((sum, s) => sum + s.pnlDollar, 0);

  container.innerHTML = `
    <button class="report-btn" onclick="generateClaudeReport()">📋 Generate Claude Report</button>

    <div class="sold-summary">
      <div class="section-label" style="padding:0 0 8px 0">Trade Summary</div>
      <div class="sold-summary-grid">
        <div class="summary-cell">
          <div class="summary-cell-val">${state.sold.length}</div>
          <div class="summary-cell-label">Trades</div>
        </div>
        <div class="summary-cell">
          <div class="summary-cell-val">${winRate}%</div>
          <div class="summary-cell-label">Win Rate</div>
        </div>
        <div class="summary-cell">
          <div class="summary-cell-val ${totalPnL>=0?'pos':'neg'}">${totalPnL>=0?'+':''}$${totalPnL.toFixed(0)}</div>
          <div class="summary-cell-label">Total P&L</div>
        </div>
        <div class="summary-cell">
          <div class="summary-cell-val">${wins.length}W / ${losses.length}L</div>
          <div class="summary-cell-label">Record</div>
        </div>
      </div>
    </div>

    <div id="sold-list"><div class="empty-state"><span class="spinner"></span></div></div>
  `;

  // Fetch current prices for "what if held"
  const tickers = [...new Set(state.sold.map(s => s.ticker))];
  let snapshots = {};
  try {
    if (state.settings.alpacaKey) snapshots = await fetchSnapshots(tickers);
  } catch(e) {}

  let html = '';
  state.sold.forEach(s => {
    const snap = snapshots[s.ticker];
    const currentPrice = snap?.dailyBar?.c || snap?.latestTrade?.p || null;
    const pnlCls = s.pnlDollar >= 0 ? 'profit' : 'loss';

    let whifHtml = '';
    if (currentPrice) {
      const whif = (currentPrice - s.buyPrice) * s.shares;
      const better = whif > s.pnlDollar;
      whifHtml = `<div class="whif">
        What if held? Current: $${currentPrice.toFixed(2)} →
        <span class="${better?'bad':'good'}">
          ${better ? `Should have held (+$${(whif-s.pnlDollar).toFixed(2)})` : `Selling was right ✓ (saved $${(s.pnlDollar-whif).toFixed(2)})`}
        </span>
      </div>`;
    }

    html += `<div class="sold-card ${pnlCls}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="ticker-sym">${s.ticker}</span>
            <span style="font-size:11px;color:var(--muted)">${s.source}</span>
          </div>
          <div class="company-name mt4">${s.company}</div>
          <div class="pf-meta">${s.shares} sh · Buy $${s.buyPrice.toFixed(2)} → Sell $${s.sellPrice.toFixed(2)}</div>
          <div class="pf-meta">${s.buyDate} → ${s.sellDate} (${s.daysHeld}d)</div>
        </div>
        <div class="sold-pnl ${s.pnlDollar>=0?'pos':'neg'}">
          ${s.pnlDollar>=0?'+':''}$${s.pnlDollar.toFixed(2)}<br>
          <span style="font-size:13px">${s.pnlPct>=0?'▲':'▼'}${Math.abs(s.pnlPct).toFixed(1)}%</span>
        </div>
      </div>
      <div class="card-sub mt4">
        Score ${s.scoreAtBuy}/100 · RSI ${s.rsiAtBuy?.toFixed(0)} · ${s.duration} · ${s.sellWarningAtSale?.replace('_',' ')||'HOLDING'} at sale
      </div>
      ${whifHtml}
    </div>`;
  });

  const listEl = document.getElementById('sold-list');
  if (listEl) listEl.innerHTML = html;
}

function generateClaudeReport() {
  const now = new Date();
  const dateStr = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const sold = state.sold;

  if (!sold.length) { alert('No completed trades to report yet.'); return; }

  const wins   = sold.filter(s => s.pnlPct > 0);
  const losses = sold.filter(s => s.pnlPct <= 0);
  const apps   = sold.filter(s => s.source === 'App Signal');
  const owns   = sold.filter(s => s.source === 'Own Decision');
  const appWins = apps.filter(s => s.pnlPct > 0);
  const ownWins = owns.filter(s => s.pnlPct > 0);
  const totalPnL = sold.reduce((s,t) => s + t.pnlDollar, 0);

  const avg = (arr, fn) => arr.length ? (arr.reduce((s,x) => s + fn(x), 0) / arr.length) : 0;
  const avgWinPnL = avg(wins, s => s.pnlDollar).toFixed(2);
  const avgLossPnL = avg(losses, s => s.pnlDollar).toFixed(2);
  const best  = sold.reduce((a,b) => b.pnlPct > a.pnlPct ? b : a, sold[0]);
  const worst = sold.reduce((a,b) => b.pnlPct < a.pnlPct ? b : a, sold[0]);

  const sellNowCount  = sold.filter(s => s.sellWarningAtSale === 'SELL_NOW').length;
  const sellSoonCount = sold.filter(s => s.sellWarningAtSale === 'SELL_SOON').length;
  const holdingCount  = sold.filter(s => s.sellWarningAtSale === 'HOLDING').length;

  const tierStats = (min, max, label) => {
    const t = sold.filter(s => {
      const p = s.sellPrice;
      return p >= min && p <= max;
    });
    const tw = t.filter(s => s.pnlPct > 0);
    return `${label}: ${t.length} trades | ${t.length?((tw.length/t.length*100).toFixed(0)):'—'}% win rate | avg ${t.length?avg(t,s=>s.pnlPct).toFixed(1):'—'}%`;
  };

  const durStats = (dur, label) => {
    const t = sold.filter(s => s.duration === dur);
    const tw = t.filter(s => s.pnlPct > 0);
    return `${label}: ${t.length} trades | ${t.length?((tw.length/t.length*100).toFixed(0)):'—'}% win rate | avg ${t.length?avg(t,s=>s.pnlPct).toFixed(1):'—'}%`;
  };

  const scoreStats = (lo, hi) => {
    const t = sold.filter(s => s.scoreAtBuy >= lo && s.scoreAtBuy <= hi);
    const tw = t.filter(s => s.pnlPct > 0);
    return `Score ${lo}–${hi}: ${t.length} trades | ${t.length?((tw.length/t.length*100).toFixed(0)):'—'}% win rate`;
  };

  const rsiBucket = (lo, hi, label) => {
    const t = sold.filter(s => (s.rsiAtBuy||0) >= lo && (s.rsiAtBuy||0) < hi);
    const tw = t.filter(s => s.pnlPct > 0);
    return `  ${label}: ${t.length} trades | ${t.length?((tw.length/t.length*100).toFixed(0)):'—'}% win rate | avg outcome ${t.length?avg(t,s=>s.pnlPct).toFixed(1):'—'}%`;
  };

  const volBucket = (lo, hi, label) => {
    const t = sold.filter(s => (s.volRatioAtBuy||0) >= lo && (s.volRatioAtBuy||0) < hi);
    const tw = t.filter(s => s.pnlPct > 0);
    return `  ${label}: ${t.length} trades | ${t.length?((tw.length/t.length*100).toFixed(0)):'—'}% win rate | avg outcome ${t.length?avg(t,s=>s.pnlPct).toFixed(1):'—'}%`;
  };

  const macroCondStats = (condition, label) => {
    const t = sold.filter(s => s.macroConditionAtBuy === condition);
    const tw = t.filter(s => s.pnlPct > 0);
    return `  ${label}: ${t.length} trades | ${t.length?((tw.length/t.length*100).toFixed(0)):'—'}% win rate | avg outcome ${t.length?avg(t,s=>s.pnlPct).toFixed(1):'—'}%`;
  };

  const macroSectorWeaknessStats = (label) => {
    const t = sold.filter(s => (s.macroConditionAtBuy||'').startsWith('SECTOR_WEAKNESS'));
    const tw = t.filter(s => s.pnlPct > 0);
    return `  ${label}: ${t.length} trades | ${t.length?((tw.length/t.length*100).toFixed(0)):'—'}% win rate | avg outcome ${t.length?avg(t,s=>s.pnlPct).toFixed(1):'—'}%`;
  };

  const momentumActivatedTrades = sold.filter(s => s.momentumProtectionActivated);
  const momentumTrailingTrades  = sold.filter(s => s.trailingStopTriggered);
  const momentumRsiEarlyTrades  = sold.filter(s => s.rsiSuspendedAtGainPct != null);

  let report = `EDGE TRADE SIGNALS — CLAUDE ANALYSIS REPORT
Generated: ${dateStr}
App Version: ${VERSION}

=== INSTRUCTIONS FOR CLAUDE ===
I use a mobile trading signals app called EDGE Trade Signals. Below is my complete
trading history including the signal data the app used to make each recommendation.
Please analyze what the scoring system is getting right and wrong, identify which
signals are most predictive of profit for my specific trading style, and write a
revised "Scoring System", "Risk Score Formula", and "Trade Duration Classification"
section I can paste into my Claude Code spec to improve the next version of the app.
Also note any patterns in my behavior (app signals vs own decisions, hold times,
sell warning compliance) that might help me trade better.

=== AUTO-FLAGGED PATTERNS (informational only — not yet acted on) ===
${(()=>{
  if (!sold.length) return '  No completed trades yet.';
  const flags = [];
  const avgRsiW = avg(wins,s=>s.rsiAtBuy||0);
  const avgRsiL = avg(losses,s=>s.rsiAtBuy||0);
  if (wins.length && losses.length && Math.abs(avgRsiW-avgRsiL)/Math.max(avgRsiL,1)*100 > 15) {
    const dir = avgRsiW < avgRsiL ? 'LOWER' : 'HIGHER';
    flags.push(`⚠ Avg RSI at purchase: wins ${avgRsiW.toFixed(1)} vs losses ${avgRsiL.toFixed(1)} — wins had ${dir} RSI than losses.\n  Current scoring rewards RSI 50-65 with 20pts. Sample size: ${sold.length} trades.\n  Consider re-evaluating once sample reaches 25-30 trades.`);
  }
  const avgVolW = avg(wins,s=>s.volRatioAtBuy||0);
  const avgVolL = avg(losses,s=>s.volRatioAtBuy||0);
  if (wins.length && losses.length && Math.abs(avgVolW-avgVolL)/Math.max(avgVolL,1)*100 > 15) {
    const dir = avgVolW < avgVolL ? 'LOWER' : 'HIGHER';
    flags.push(`⚠ Avg volume ratio at purchase: wins ${avgVolW.toFixed(2)}x vs losses ${avgVolL.toFixed(2)}x — wins had ${dir} volume ratio than losses.\n  Current scoring rewards higher volume. Sample size: ${sold.length} trades.\n  Consider re-evaluating once sample reaches 25-30 trades.`);
  }
  const avgScoreW = avg(wins,s=>s.scoreAtBuy||0);
  const avgScoreL = avg(losses,s=>s.scoreAtBuy||0);
  if (wins.length && losses.length && Math.abs(avgScoreW-avgScoreL)/Math.max(avgScoreL,1)*100 > 15) {
    const dir = avgScoreW < avgScoreL ? 'LOWER' : 'HIGHER';
    flags.push(`⚠ Avg signal score at purchase: wins ${avgScoreW.toFixed(1)} vs losses ${avgScoreL.toFixed(1)} — wins had ${dir} score than losses.\n  Current scoring uses 80+ = STRONG BUY. Sample size: ${sold.length} trades.\n  Consider re-evaluating once sample reaches 25-30 trades.`);
  }
  return flags.length ? flags.join('\n\n') : '  No divergences >15% detected between wins and losses on RSI, volume ratio, or signal score.';
})()}

=== APP CONFIGURATION AT TIME OF REPORT ===
Version: ${VERSION}
Budget: $${state.settings.budget}
Min Volume Threshold: ${(state.settings.minVolume||100000).toLocaleString()}
Include Under $2: ${state.settings.includeUnder2?'Yes':'No'}
Show WATCH signals: ${state.settings.showWatch?'Yes':'No'}

=== SUMMARY STATISTICS ===
Total completed trades: ${sold.length}
  - App signal trades: ${apps.length} (${sold.length?(apps.length/sold.length*100).toFixed(0):0}% of total)
  - Own decision trades: ${owns.length} (${sold.length?(owns.length/sold.length*100).toFixed(0):0}% of total)

Overall win rate: ${sold.length?((wins.length/sold.length*100).toFixed(0)):0}%
  - App signal win rate: ${apps.length?((appWins.length/apps.length*100).toFixed(0)):0}%
  - Own decision win rate: ${owns.length?((ownWins.length/owns.length*100).toFixed(0)):0}%

Average profit on wins: +$${avgWinPnL} (${avg(wins,s=>s.pnlPct).toFixed(1)}%)
Average loss on losses: $${avgLossPnL} (${avg(losses,s=>s.pnlPct).toFixed(1)}%)
Best trade: ${best.ticker} +$${best.pnlDollar.toFixed(2)} (+${best.pnlPct.toFixed(1)}%)
Worst trade: ${worst.ticker} $${worst.pnlDollar.toFixed(2)} (${worst.pnlPct.toFixed(1)}%)

Signal data at purchase — wins vs losses:
  Avg RSI:          wins ${avg(wins,s=>s.rsiAtBuy||0).toFixed(1)}  | losses ${avg(losses,s=>s.rsiAtBuy||0).toFixed(1)}
  Avg volume ratio: wins ${avg(wins,s=>s.volRatioAtBuy||0).toFixed(2)}x | losses ${avg(losses,s=>s.volRatioAtBuy||0).toFixed(2)}x
  Avg risk score:   wins ${avg(wins,s=>s.riskAtBuy||0).toFixed(1)}  | losses ${avg(losses,s=>s.riskAtBuy||0).toFixed(1)}
  Avg signal score: wins ${avg(wins,s=>s.scoreAtBuy||0).toFixed(1)}  | losses ${avg(losses,s=>s.scoreAtBuy||0).toFixed(1)}
  Avg hold time:    wins ${avg(wins,s=>s.daysHeld||0).toFixed(1)} days | losses ${avg(losses,s=>s.daysHeld||0).toFixed(1)} days

RSI at purchase — win rate by bucket:
${rsiBucket(0,45,'<45    ')}
${rsiBucket(45,55,'45–55  ')}
${rsiBucket(55,65,'55–65  ')}
${rsiBucket(65,999,'65+    ')}

Volume ratio at purchase — win rate by bucket:
${volBucket(0,1.0,'<1.0x  ')}
${volBucket(1.0,2.0,'1.0–2x ')}
${volBucket(2.0,3.0,'2–3x   ')}
${volBucket(3.0,999,'3x+    ')}

Sell warning compliance:
  Trades where SELL NOW was showing at sale: ${sellNowCount}
  Trades where SELL SOON was showing at sale: ${sellSoonCount}
  Trades where HOLDING was showing at sale: ${holdingCount}

Performance by signal type at purchase:
  VOL BUILD signal fired:
    Trades: ${sold.filter(s=>(s.signalsFiredAtBuy||[]).includes('VOL_BUILD')).length}
    Win rate: ${(()=>{const t=sold.filter(s=>(s.signalsFiredAtBuy||[]).includes('VOL_BUILD'));return t.length?((t.filter(s=>s.pnlPct>0).length/t.length*100).toFixed(0)+'%'):'N/A';})()}
  MEAN REVERSION signal fired:
    Trades: ${sold.filter(s=>(s.signalsFiredAtBuy||[]).includes('MEAN_REVERSION')).length}
    Win rate: ${(()=>{const t=sold.filter(s=>(s.signalsFiredAtBuy||[]).includes('MEAN_REVERSION'));return t.length?((t.filter(s=>s.pnlPct>0).length/t.length*100).toFixed(0)+'%'):'N/A';})()}
  Neither special signal:
    Trades: ${sold.filter(s=>!(s.signalsFiredAtBuy||[]).length).length}
    Win rate: ${(()=>{const t=sold.filter(s=>!(s.signalsFiredAtBuy||[]).length);return t.length?((t.filter(s=>s.pnlPct>0).length/t.length*100).toFixed(0)+'%'):'N/A';})()}

Performance by price tier:
  ${tierStats(1,3,'$1–$3')}
  ${tierStats(4,9,'$4–$9')}
  ${tierStats(10,20,'$10–$20')}

Performance by duration classification:
  ${durStats('DAY','Exit Today')}
  ${durStats('3-DAY','Est. 2-4 Days')}
  ${durStats('WEEK','Est. 5-7 Days')}

Performance by signal score at purchase:
  ${scoreStats(20,49)}
  ${scoreStats(50,79)}
  ${scoreStats(80,100)}

=== NEAR-MISS SIGNAL ANALYSIS ===

VOL_BUILD near-misses (signal didn't fire, but close):
${(()=>{
  // Change 10 (Scoring Formula v2): near-miss threshold shifted from 2 to 1
  // consecutive day, matching VOL_BUILD's firing threshold moving from 3 to 2 days.
  const t2 = sold.filter(s=>s.volBuildNearMiss && s.volBuildNearMiss.consecutiveDays===1);
  const t2w = t2.filter(s=>s.pnlPct>0);
  const tr = sold.filter(s=>s.volBuildNearMiss && s.volBuildNearMiss.volRatio>=1.0 && s.volBuildNearMiss.volRatio<1.3);
  const trw = tr.filter(s=>s.pnlPct>0);
  return `  Trades where consecutive days was 1 (needed 2): ${t2.length} | win rate ${t2.length?((t2w.length/t2.length*100).toFixed(0)):'—'}%
  Trades where vol ratio was 1.0–1.3x (needed 1.3x+): ${tr.length} | win rate ${tr.length?((trw.length/tr.length*100).toFixed(0)):'—'}%`;
})()}

MEAN_REVERSION near-misses:
${(()=>{
  const t48 = sold.filter(s=>s.meanReversionNearMiss && s.meanReversionNearMiss.pctBelowMA<=-4 && s.meanReversionNearMiss.pctBelowMA>-8);
  const t48w = t48.filter(s=>s.pnlPct>0);
  const tr = sold.filter(s=>s.meanReversionNearMiss && s.meanReversionNearMiss.rsi>=45 && s.meanReversionNearMiss.rsi<50);
  const trw = tr.filter(s=>s.pnlPct>0);
  return `  Trades where price was 4–8% below MA (needed 8–15%): ${t48.length} | win rate ${t48.length?((t48w.length/t48.length*100).toFixed(0)):'—'}%
  Trades where RSI was 45–50 (needed <45): ${tr.length} | win rate ${tr.length?((trw.length/tr.length*100).toFixed(0)):'—'}%`;
})()}

Target drift at time of sale:
${(()=>{
  const higher = sold.filter(s=>s.targetDriftPct!=null && s.targetDriftPct>5);
  const higherW = higher.filter(s=>s.pnlPct>0);
  const lower = sold.filter(s=>s.targetDriftPct!=null && s.targetDriftPct<-5);
  const lowerW = lower.filter(s=>s.pnlPct>0);
  const within = sold.filter(s=>s.targetDriftPct!=null && Math.abs(s.targetDriftPct)<=5);
  const withinW = within.filter(s=>s.pnlPct>0);
  return `  Trades where live target was >5% higher than original:  ${higher.length} | win rate ${higher.length?((higherW.length/higher.length*100).toFixed(0)):'—'}%
  Trades where live target was >5% lower than original:   ${lower.length} | win rate ${lower.length?((lowerW.length/lower.length*100).toFixed(0)):'—'}%
  Trades where live target was within 5% of original:     ${within.length} | win rate ${within.length?((withinW.length/within.length*100).toFixed(0)):'—'}%`;
})()}

Target capping at time of purchase:
${(()=>{
  const cap52 = sold.filter(s=>s.cappedByAtBuy==='52-week high');
  const cap52w = cap52.filter(s=>s.pnlPct>0);
  const capSwing = sold.filter(s=>s.cappedByAtBuy==='recent swing high');
  const capSwingW = capSwing.filter(s=>s.pnlPct>0);
  const capMA = sold.filter(s=>s.cappedByAtBuy==='20-day MA');
  const capMAW = capMA.filter(s=>s.pnlPct>0);
  const uncapped = sold.filter(s=>!s.cappedByAtBuy);
  const uncappedW = uncapped.filter(s=>s.pnlPct>0);
  return `  Trades where target was capped by 52-week high:    ${cap52.length} | win rate ${cap52.length?((cap52w.length/cap52.length*100).toFixed(0)):'—'}%
  Trades where target was capped by swing high:      ${capSwing.length} | win rate ${capSwing.length?((capSwingW.length/capSwing.length*100).toFixed(0)):'—'}%
  Trades where target was capped by 20-day MA:       ${capMA.length} | win rate ${capMA.length?((capMAW.length/capMA.length*100).toFixed(0)):'—'}%
  Trades where target was NOT capped (ATR ruled):    ${uncapped.length} | win rate ${uncapped.length?((uncappedW.length/uncapped.length*100).toFixed(0)):'—'}%`;
})()}

ATR trimming impact at time of purchase:
${(()=>{
  const withAtr = sold.filter(s=>s.rawAtrAtBuy!=null && s.trimmedAtrAtBuy!=null);
  if (!withAtr.length) return '  No trades with ATR data recorded yet.';
  const avgRaw = avg(withAtr, s=>s.rawAtrAtBuy);
  const avgTrimmed = avg(withAtr, s=>s.trimmedAtrAtBuy);
  const reductionPct = avgRaw > 0 ? ((avgRaw - avgTrimmed) / avgRaw * 100) : 0;
  return `  Avg raw ATR across all trades:     ${avgRaw.toFixed(3)}
  Avg trimmed ATR across all trades: ${avgTrimmed.toFixed(3)}
  Avg reduction from trimming:       ${reductionPct.toFixed(1)}% smaller`;
})()}

=== MACRO CONDITION AT TIME OF PURCHASE ===

Trades by market condition:
${macroCondStats('RISK_OFF',          'RISK_OFF:            ')}
${macroCondStats('GEOPOLITICAL',      'GEOPOLITICAL:        ')}
${macroCondStats('TECH_ROTATION_OUT', 'TECH_ROTATION_OUT:   ')}
${macroCondStats('BROAD_RALLY',       'BROAD_RALLY:         ')}
${macroCondStats('MOMENTUM_DAY',      'MOMENTUM_DAY:        ')}
${macroSectorWeaknessStats(          'SECTOR_WEAKNESS_*:   ')}
${macroCondStats('CHOPPY',            'CHOPPY:              ')}

=== MOMENTUM PROTECTION ===

Trades where Momentum Protection activated:     ${momentumActivatedTrades.length}
Avg outcome on those trades:                    ${momentumActivatedTrades.length ? avg(momentumActivatedTrades, s=>s.pnlPct).toFixed(1) : '—'}%
Trades where trailing stop triggered exit:      ${momentumTrailingTrades.length} | avg outcome ${momentumTrailingTrades.length ? avg(momentumTrailingTrades, s=>s.pnlPct).toFixed(1) : '—'}%
Trades where RSI would have triggered early:    ${momentumRsiEarlyTrades.length} | avg gain at that
  point ${momentumRsiEarlyTrades.length ? avg(momentumRsiEarlyTrades, s=>s.rsiSuspendedAtGainPct).toFixed(1) : '—'}% (shows how much would have been left on the table)

=== FULL TRADE HISTORY ===

`;

  sold.forEach((s, i) => {
    report += `Trade #${i+1}
  Ticker: ${s.ticker} — ${s.company}
  Bought: $${s.buyPrice.toFixed(2)} on ${s.buyDate}
  Sold: $${s.sellPrice.toFixed(2)} on ${s.sellDate}
  Shares: ${s.shares} | Days held: ${s.daysHeld}
  Result: ${s.pnlDollar>=0?'WIN':'LOSS'} $${s.pnlDollar.toFixed(2)} (${s.pnlPct.toFixed(1)}%)
  Source: ${s.source}
  Signal score at purchase: ${s.scoreAtBuy}/100
  Signals fired at purchase: ${(s.signalsFiredAtBuy||[]).length ? s.signalsFiredAtBuy.join(', ') : 'none'}
  RSI at purchase: ${s.rsiAtBuy?.toFixed(1)||'N/A'}
  Volume ratio at purchase: ${s.volRatioAtBuy?.toFixed(2)||'N/A'}x
  Risk score at purchase: ${s.riskAtBuy||'N/A'}/10
  Duration classification: ${s.duration}
  Price tier: ${s.priceRange}
  News at purchase: ${s.newsAtBuy||'none'}
  Sell warning at time of sale: ${(s.sellWarningAtSale||'HOLDING').replace('_',' ')}

`;
  });

  report += `=== CURRENT SCORING FORMULA (for Claude's reference) ===

Scoring System — Scoring Formula v2 (raw signal points normalized to 0–100 via
round(raw / ${RAW_SCORE_MAX} * 100), then clamped 0–100 after the Macro Market Overlay
adjustment below is applied):
  Volume spike:        −10 to +20 pts (<0.5x=0, 0.5-1x=15, 1-2x=20 best zone, 2-3x=10, 3x+=−10)
  Volume build:        0–15 pts (2 consecutive days rising + today >=1.3x avg)
  Price momentum:      0–20 pts (2-4%=10, 4%+=20)
  RSI position:        −10 to +20 pts (<35=10, 35-55=15, 55-65=20 best zone, 65-75=0, 75+=−10)
  Above 20-day MA:     10 pts
  Relative strength:   0–15 pts (outperform SPY by >0%=5, >1%=10, >2%=15)
  Consecutive up days: 0–15 pts (2 days=5, 3 days=10, 4+ days=15)
  Mean reversion:      0–20 pts (price 8-15% below MA, RSI<45, RSI turning up)

RAW_SCORE_MAX (${RAW_SCORE_MAX}) is the sum of max POSITIVE points only, so a score
can never exceed 100 regardless of which negative signals fire.

Labels: 80–100=STRONG BUY | 50–79=SOFT BUY | 20–49=WATCH | <20=excluded

Risk Score (1–10):
  Base by price tier: $1–$3=6, $4–$9=4, $10–$20=3
  ATR >10% of price: +2, >6%: +1
  RSI >75 or <30: +2
  Negative news: +2
  Cap: 1–10

Trade Duration:
  DAY:   RSI>68 OR vol>3x
  WEEK:  RSI 48-60 trending up AND vol 1.2-1.8x
  3-DAY: Default (RSI 52-68 AND vol 1.5-3x)
`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `edge-report-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── 19. SETTINGS TAB ──────────────────────────────────────────────

function renderSettingsTab() {
  const s = state.settings;
  document.getElementById('tab-content').innerHTML = `
    <div class="tab-header"><h1 class="tab-title">SETTINGS</h1></div>

    <div class="settings-section">
      <div class="settings-section-title">API Keys</div>
      <div class="settings-row" style="flex-direction:column;align-items:stretch;">
        <div class="settings-label">Alpaca API Key ID</div>
        <input id="set-alpaca-key" class="settings-input mt4" type="text"
          placeholder="PKXXXXXXXXXX" value="${s.alpacaKey||''}">
      </div>
      <div class="settings-row" style="flex-direction:column;align-items:stretch;">
        <div class="settings-label">Alpaca Secret Key</div>
        <div class="pw-wrap mt4">
          <input id="set-alpaca-secret" class="settings-input" type="password"
            placeholder="••••••••" value="${s.alpacaSecret||''}">
          <button class="pw-toggle" onclick="togglePw('set-alpaca-secret')">👁</button>
        </div>
      </div>
      <div class="settings-row" style="flex-direction:column;align-items:stretch;">
        <div class="settings-label">Groq API Key</div>
        <div class="pw-wrap mt4">
          <input id="set-groq-key" class="settings-input" type="password"
            placeholder="gsk_••••••••" value="${s.groqKey||''}">
          <button class="pw-toggle" onclick="togglePw('set-groq-key')">👁</button>
        </div>
      </div>
      <div class="settings-row">
        <button class="btn btn-primary btn-sm" onclick="saveApiKeys()">Save Keys</button>
        <button class="btn btn-ghost btn-sm" onclick="testConnections()">Test Connections</button>
      </div>
      <div id="test-results"></div>
    </div>

    <div class="settings-section mt12">
      <div class="settings-section-title">Budget</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">My Trading Budget</div>
          <div class="settings-hint">Total capital allocated for trading</div>
        </div>
        <input id="set-budget" class="settings-number" type="number"
          min="0" step="10" value="${s.budget||500}">
      </div>
      <div class="settings-row">
        <button class="btn btn-primary btn-sm" onclick="saveBudget()">Save Budget</button>
      </div>
    </div>

    <div class="settings-section mt12">
      <div class="settings-section-title">Screener Preferences</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Include stocks under $2</div>
          <div class="settings-hint">Default OFF — higher risk</div>
        </div>
        <label class="toggle-wrap">
          <input type="checkbox" id="set-under2" ${s.includeUnder2?'checked':''} onchange="savePref('includeUnder2',this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="settings-row" style="flex-direction:column;align-items:stretch;">
        <div class="settings-label">Minimum Volume Threshold</div>
        <div class="segmented mt4">
          ${[100000,250000,500000].map(v =>
            `<div class="seg-btn ${(s.minVolume||100000)===v?'active':''}"
              onclick="setMinVol(${v})">${v===100000?'100K':v===250000?'250K':'500K+'}</div>`
          ).join('')}
        </div>
      </div>
    </div>

    <div class="settings-section mt12">
      <div class="settings-section-title">Scoring Formula</div>
      <div class="score-table">
        <div class="score-row"><span>Volume spike (1.5–3×+)</span><span>0–30 pts</span></div>
        <div class="score-row"><span>Volume build (3-day rise)</span><span>+15 pts</span></div>
        <div class="score-row"><span>Price momentum (2–4%+)</span><span>0–20 pts</span></div>
        <div class="score-row"><span>RSI position</span><span>0–20 pts</span></div>
        <div class="score-row"><span>Above 20-day MA</span><span>+10 pts</span></div>
        <div class="score-row"><span>Relative strength vs market</span><span>0–15 pts</span></div>
        <div class="score-row"><span>Consecutive up days</span><span>0–15 pts</span></div>
        <div class="score-row"><span>Mean reversion setup</span><span>+20 pts</span></div>
        <div class="score-row score-row-total"><span>Total (capped)</span><span>100 pts</span></div>
        <div class="score-row"><span class="score-label-strong">STRONG BUY</span><span>80–100</span></div>
        <div class="score-row"><span class="score-label-soft">SOFT BUY</span><span>50–79</span></div>
        <div class="score-row"><span class="score-label-watch">WATCH</span><span>20–49</span></div>
      </div>
    </div>

    <div class="settings-section mt12">
      <div class="settings-section-title">Screener Health</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Active Universe</div>
          <div class="settings-hint">${state.selectedUniverse} — ${STOCK_UNIVERSES[state.selectedUniverse]?.length || 0} tickers</div>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Universe Sizes</div>
          <div class="settings-hint">HEALTHCARE ${STOCK_UNIVERSES.HEALTHCARE.length} · ENERGY ${STOCK_UNIVERSES.ENERGY.length} · TECH ${STOCK_UNIVERSES.TECH.length} · RETAIL ${STOCK_UNIVERSES.RETAIL.length} · FINANCIAL ${STOCK_UNIVERSES.FINANCIAL.length} · INDUSTRIAL ${STOCK_UNIVERSES.INDUSTRIAL.length} · BROAD ${STOCK_UNIVERSES.BROAD.length}</div>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Last Scan Candidates</div>
          <div class="settings-hint">${state.lastPassedCount ? `${state.lastPassedCount} stocks passed price &amp; volume filters` : 'No scan run yet'}</div>
        </div>
      </div>
    </div>

    ${(function() {
      const notif = state.notifications;
      const perm = ('Notification' in window) ? Notification.permission : 'unsupported';
      const isActive = perm === 'granted' && notif.enabled;
      const activeMark = isActive ? ' <span style="color:#22c55e;font-size:14px;vertical-align:middle;">✓</span>' : '';

      let lastCheckText = 'Never';
      if (notif.lastPriceCheck) {
        const mins = Math.round((Date.now() - new Date(notif.lastPriceCheck).getTime()) / 60000);
        lastCheckText = mins < 1 ? 'Just now' : `${mins} minute${mins === 1 ? '' : 's'} ago`;
      }
      let nextCheckText = 'Pending';
      if (_notifNextCheckTime) {
        const minsLeft = Math.max(0, Math.round((_notifNextCheckTime - Date.now()) / 60000));
        nextCheckText = minsLeft < 1 ? 'Imminent' : `in ${minsLeft} minute${minsLeft === 1 ? '' : 's'}`;
      }

      let body = '';
      if (perm === 'granted') {
        body = `
          <div class="settings-row">
            <div>
              <div class="settings-label">Enable All Notifications</div>
              <div class="settings-hint">Status: ${notif.enabled ? 'Active' : 'Disabled'}</div>
            </div>
            <label class="toggle-wrap">
              <input type="checkbox" ${notif.enabled ? 'checked' : ''} onchange="toggleNotifications(this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-label">Last price check</div>
              <div class="settings-hint">${lastCheckText}</div>
            </div>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-label">Next check</div>
              <div class="settings-hint">${nextCheckText}</div>
            </div>
          </div>`;
      } else if (perm === 'denied') {
        body = `<div class="settings-hint" style="color:#f87171;line-height:1.5;">
          To enable notifications, go to your browser settings and allow notifications for this site.</div>`;
      } else if (perm === 'default') {
        body = `<div class="settings-row">
          <button class="btn btn-primary btn-sm" onclick="requestNotificationPermission().then(()=>renderSettingsTab())">Enable Notifications</button>
        </div>`;
      } else {
        body = `<div class="settings-hint muted">Push notifications are not supported in this browser.</div>`;
      }

      return `<div class="settings-section mt12">
        <div class="settings-section-title">Push Notifications${activeMark}</div>
        ${body}
      </div>`;
    })()}

    <div class="settings-section mt12">
      <div class="settings-section-title">App Info</div>
      <div class="settings-row">
        <span class="settings-label">Version</span>
        <span class="mono muted">${VERSION}</span>
      </div>
      <div class="settings-row">
        <button class="btn btn-ghost btn-sm" onclick="exportAllData()">Export All Data</button>
        <button class="btn btn-danger btn-sm" onclick="clearAllData()">Clear All Data</button>
      </div>
    </div>

    <div class="app-version">EDGE Trade Signals ${VERSION}<br>
      <a href="https://alpaca.markets" target="_blank">Get Alpaca Keys</a> ·
      <a href="https://console.groq.com/keys" target="_blank">Get Groq Key</a>
    </div>
  `;
}

function togglePw(id) {
  const el = document.getElementById(id);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
}

function saveApiKeys() {
  state.settings.alpacaKey    = document.getElementById('set-alpaca-key')?.value.trim() || '';
  state.settings.alpacaSecret = document.getElementById('set-alpaca-secret')?.value.trim() || '';
  state.settings.groqKey      = document.getElementById('set-groq-key')?.value.trim() || '';
  persist('settings');
  alert('API keys saved.');
}

function saveBudget() {
  state.settings.budget = parseFloat(document.getElementById('set-budget')?.value) || 500;
  persist('settings');
  updateBudgetBar();
  alert('Budget saved.');
}

function savePref(key, val) {
  state.settings[key] = val;
  persist('settings');
}

function setMinVol(val) {
  state.settings.minVolume = val;
  persist('settings');
  renderSettingsTab();
}

async function testConnections() {
  const el = document.getElementById('test-results');
  if (!el) return;
  el.innerHTML = `<div class="test-result"><span class="spinner"></span> Testing…</div>`;

  // Save keys first
  state.settings.alpacaKey    = document.getElementById('set-alpaca-key')?.value.trim() || state.settings.alpacaKey;
  state.settings.alpacaSecret = document.getElementById('set-alpaca-secret')?.value.trim() || state.settings.alpacaSecret;
  state.settings.groqKey      = document.getElementById('set-groq-key')?.value.trim() || state.settings.groqKey;
  persist('settings');

  const [alpOk, groqOk] = await Promise.all([testAlpacaConnection(), testGroqConnection()]);
  el.innerHTML = `<div class="test-result">
    <span class="${alpOk?'test-ok':'test-err'}">${alpOk?'✓':'✗'} Alpaca ${alpOk?'connected':'failed'}</span>
    <span class="${groqOk?'test-ok':'test-err'}">${groqOk?'✓':'✗'} Groq ${groqOk?'connected':'failed'}</span>
  </div>`;
}

function exportAllData() {
  const data = {
    version: VERSION,
    exported: new Date().toISOString(),
    settings: { ...state.settings, alpacaKey:'[REDACTED]', alpacaSecret:'[REDACTED]', groqKey:'[REDACTED]' },
    portfolio: state.portfolio,
    sold: state.sold,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `edge-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearAllData() {
  showConfirm('Are you sure? This will delete your portfolio and trade history. This cannot be undone.', () => {
    ['settings','portfolio','sold','signals','lastScanTime','news','lastPassedCount'].forEach(k => {
      localStorage.removeItem('edge_' + k);
    });
    TICKERS = MASTER_TICKERS;
    loadState();
    renderSettingsTab();
    updateNavBadges();
    alert('All data cleared.');
  });
}

// ── 21. PUSH NOTIFICATIONS ───────────────────────────────────────

let _swRegistration = null;
let _notifPriceInterval = null;
let _notifDailyInterval = null;
let _notifNextCheckTime = null;
const NOTIF_PRICE_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    _swRegistration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
  } catch(e) {
    console.warn('SW registration failed:', e.message);
  }
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  state.notifications.permission = Notification.permission;
  if (Notification.permission === 'default') {
    const result = await Notification.requestPermission();
    state.notifications.permission = result;
    persist('notifications');
  }
}

function isMarketHoursNow() {
  const pt = getPT();
  const tMin = pt.getHours() * 60 + pt.getMinutes();
  return isTradingDay(pt) && tMin >= 390 && tMin < 780; // 6:30am–1:00pm PT
}

function businessDaysBetween(startDateStr, endDateStr) {
  const start = new Date(startDateStr + 'T12:00:00');
  const end   = new Date(endDateStr   + 'T12:00:00');
  let count = 0;
  const cur = new Date(start);
  while (cur < end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function isDuplicateAlert(ticker, condition) {
  const last = (state.notifications.alertHistory || {})[ticker + '_' + condition];
  return last && (Date.now() - last) < 60 * 60 * 1000;
}

function recordAlert(ticker, condition) {
  if (!state.notifications.alertHistory) state.notifications.alertHistory = {};
  state.notifications.alertHistory[ticker + '_' + condition] = Date.now();
  persist('notifications');
}

async function sendNotification(title, body, tag) {
  if (Notification.permission !== 'granted') return;
  const opts = { body, tag, icon: './icon.svg', badge: './icon.svg', requireInteraction: false };
  if (_swRegistration) {
    try { await _swRegistration.showNotification(title, opts); return; } catch(e) {}
  }
  try { new Notification(title, opts); } catch(e) {}
}

async function checkPriceAlerts() {
  if (!state.notifications.enabled) return;
  if (Notification.permission !== 'granted') return;
  if (!isMarketHoursNow()) return;
  if (!state.settings.alpacaKey || !state.settings.alpacaSecret) return;
  if (!state.portfolio.length) return;

  state.notifications.lastPriceCheck = new Date().toISOString();
  persist('notifications');

  try {
    const tickers = [...new Set(state.portfolio.map(p => p.ticker))];
    const snaps = await fetchSnapshots(tickers);

    for (const pos of state.portfolio) {
      const snap = snaps[pos.ticker];
      if (!snap) continue;
      const price = snap.dailyBar?.c || snap.latestTrade?.p || 0;
      if (!price) continue;

      const { ticker, target, stop } = pos;

      if (price >= target) {
        if (!isDuplicateAlert(ticker, 'TARGET_HIT')) {
          await sendNotification('EDGE Alert',
            `🎯 ${ticker} hit your target of $${target.toFixed(2)}! SELL NOW to lock in profits.`,
            `${ticker}_TARGET_HIT`);
          recordAlert(ticker, 'TARGET_HIT');
        }
      } else if (price >= target * 0.95) {
        const pct = ((target - price) / target * 100).toFixed(1);
        if (!isDuplicateAlert(ticker, 'TARGET_NEAR')) {
          await sendNotification('EDGE Alert',
            `⚠ ${ticker} is ${pct}% from your target of $${target.toFixed(2)}. Consider taking profits soon.`,
            `${ticker}_TARGET_NEAR`);
          recordAlert(ticker, 'TARGET_NEAR');
        }
      }

      if (price <= stop) {
        if (!isDuplicateAlert(ticker, 'STOP_HIT')) {
          await sendNotification('EDGE Alert',
            `🔴 ${ticker} hit your stop loss of $${stop.toFixed(2)}! SELL NOW to limit losses.`,
            `${ticker}_STOP_HIT`);
          recordAlert(ticker, 'STOP_HIT');
        }
      } else if (price <= stop * 1.05) {
        const pct = ((price - stop) / stop * 100).toFixed(1);
        if (!isDuplicateAlert(ticker, 'STOP_NEAR')) {
          await sendNotification('EDGE Alert',
            `⚠ ${ticker} is ${pct}% from your stop loss of $${stop.toFixed(2)}. Watch closely.`,
            `${ticker}_STOP_NEAR`);
          recordAlert(ticker, 'STOP_NEAR');
        }
      }
    }
  } catch(e) {
    console.warn('Price alert check failed:', e.message);
  }
}

async function checkTimeLimitAlerts() {
  if (!state.notifications.enabled) return;
  if (Notification.permission !== 'granted') return;
  if (!state.portfolio.length) return;

  const todayStr = ptDateStr(getPT());

  for (const pos of state.portfolio) {
    const { ticker, duration, buyDate } = pos;
    let threshold = null, durationLabel = '';
    if (duration === '3-DAY')     { threshold = 4; durationLabel = 'Est. 2-4 Days'; }
    else if (duration === 'WEEK') { threshold = 7; durationLabel = 'Est. 5-7 Days'; }
    else continue; // 'DAY' — no time limit alert

    const daysHeld = businessDaysBetween(buyDate, todayStr);
    if (daysHeld > threshold && !isDuplicateAlert(ticker, 'TIME_LIMIT')) {
      await sendNotification('EDGE Alert',
        `📅 ${ticker} has been held ${daysHeld} days. Your estimated duration was ${durationLabel}. Consider selling today before market open.`,
        `${ticker}_TIME_LIMIT`);
      recordAlert(ticker, 'TIME_LIMIT');
    }
  }
}

function toggleNotifications(enabled) {
  state.notifications.enabled = enabled;
  persist('notifications');
}

function startNotificationChecks() {
  _notifNextCheckTime = Date.now() + 3000;
  setTimeout(() => {
    checkPriceAlerts();
    _notifNextCheckTime = Date.now() + NOTIF_PRICE_INTERVAL_MS;
  }, 3000);

  _notifPriceInterval = setInterval(() => {
    checkPriceAlerts();
    _notifNextCheckTime = Date.now() + NOTIF_PRICE_INTERVAL_MS;
  }, NOTIF_PRICE_INTERVAL_MS);

  _notifDailyInterval = setInterval(() => {
    const pt = getPT();
    if (pt.getHours() === 0 && pt.getMinutes() === 1) {
      const todayStr = ptDateStr(pt);
      if (state.notifications.lastDailyCheck !== todayStr) {
        state.notifications.lastDailyCheck = todayStr;
        persist('notifications');
        checkTimeLimitAlerts();
      }
    }
  }, 60000);
}

// ── 22. NAVIGATION ────────────────────────────────────────────────

function switchTab(name) {
  state.activeTab = name;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === name);
  });

  const showBudget = ['signals','portfolio'].includes(name);
  document.getElementById('budget-bar')?.classList.toggle('hidden', !showBudget);

  switch (name) {
    case 'signals':   renderSignalsTab();   break;
    case 'portfolio': renderPortfolioTab(); break;
    case 'sold':      renderSoldTab();      break;
    case 'settings':  renderSettingsTab();  break;
  }

  updateBudgetBar();
}

function updateNavBadges() {
  // Portfolio: count active sell warnings
  const pfBadge = document.getElementById('badge-portfolio');
  if (pfBadge) {
    let warnCount = 0;
    if (isAfternoonMode()) {
      state.portfolio.forEach(p => {
        const price = state.portfolioPrices[p.ticker] || p.buyPrice;
        const w = calcSellWarning(p, price, p.rsiAtBuy, 0);
        if (w === 'SELL_NOW' || w === 'SELL_SOON') warnCount++;
      });
    }
    pfBadge.textContent = warnCount;
    pfBadge.classList.toggle('hidden', warnCount === 0);
  }
}

// ── 23. CLOCK / REFRESH ───────────────────────────────────────────

function startClock() {
  updateMarketBanner();
  updateNavBadges();
  setInterval(() => {
    updateMarketBanner();
    updateNavBadges();
  }, 30000); // every 30 seconds
}

// ── 24. INIT ─────────────────────────────────────────────────────

async function init() {
  loadState();
  await registerServiceWorker();
  await requestNotificationPermission();
  startClock();
  startNotificationChecks();
  renderSignalsTab();
  updateNavBadges();
}

init();
