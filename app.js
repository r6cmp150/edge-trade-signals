'use strict';
// ================================================================
// EDGE Trade Signals — app.js  v1.0.0
// ================================================================

// ── 1. CONSTANTS ────────────────────────────────────────────────

const VERSION = 'v1.0.0';
const ALPACA_BASE = 'https://data.alpaca.markets/v2';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ── MASTER TICKERS — 1500 tickers scanned on every Refresh ──────
const MASTER_TICKERS = [...new Set([
  'SNDL','CLOV','MVIS','WKHS','GOEV','SPWR','PLUG','FCEL','BLNK','IDEX',
  'ZOM','CPRX','CRON','ACB','TLRY','COTY','F','SNAP','SOFI','HOOD',
  'LCID','XPEV','NIO','MARA','RIOT','HUT','BITF','CLSK','CIFR','KOSS',
  'EXPR','AMC','FFIE','MULN','XELA','KPLT','GFAI','OCGN','INO','NVAX',
  'SRNE','ATOS','CTIC','JAGX','LXRX','OCUL','RILY','SAVA','UAVS','VNRX',
  'WTER','YCBD','NKLA','RIDE','HYLN','ARBK','HIVE','VERB','PHUN','CSSE',
  'PAYA','PDSB','ALBT','AEYE','SEEL','CPIX','NCPL','HCWB','CHRS','MTSL',
  'MVST','WATT','VVPR','SIGA','BLPH','OBSV','VBIV','CIDM','CYTH','DFFN',
  'GNPX','INFI','KMPH','MYOV','NBSE','PRPO','QLGN','TPVG','XBIO','ZSAN',
  'OGEN','APHA','SFIX','WISH','RIVN','BBBY','GME','NEXT','AULT','MDJM',
  'LIZI','CORZ','WULF','BTBT','IREN','GRIID','MGTI','BTCS','EBON','SDIG',
  'BKKT','BTDR','SOS','MIGI','GIGA','COIN','MSTR','BTCM','NILE','BSRT',
  'DMG','CGC','GRWG','MAPS','GNLN','VFF','MRMD','CLVR','CBDD','KERN',
  'HARB','SOLO','AYRO','HYZN','ARVL','PTRA','EVGO','CHPT','ZEV','EOSE',
  'FREYR','FSR','CENN','ELMS','VIEW','OPAD','NRGV','SEAT','BEEM','WPRT',
  'FREY','NOVA','RUN','ARRY','MAXN','STEM','BLDP','GEVO','AMRC','CLNE',
  'AMPE','BWEN','CLFD','SUNW','SHLS','FLNC','VSLR','ENPH','NKTR','PNTM',
  'SPPI','ADMA','AGEN','ADTX','AKBA','ATNF','AYTU','AZRX','BCAB','BNGO',
  'BNTC','AMRN','ANIX','ANVS','APRE','ARDX','ARQT','ASRT','ATHA','ATXI',
  'AUPH','AVXL','AXLA','BFRI','BIOL','BTAI','BXRX','CARA','CASI','CCXI',
  'CDTX','CGEM','CGEN','CKPT','CLBS','CLSD','CLVS','CMPS','CNCE','COCP',
  'CODX','CPHI','CRDF','CRNX','CRTX','CRVS','CTXR','CYCN','CYTO','EDSA',
  'ELOX','TIGR','FUTU','BEKE','UP','CNF','RTC','DADA','DOYU','DQ',
  'EDTK','EH','EZGO','FANH','GDS','GOTU','IH','JFIN','JOBS','JMU',
  'MOMO','NTES','QFIN','RCON','SFUN','TUYA','VNET','WB','HUYA','IQ',
  'TME','BB','NOK','SPCE','SKLZ','BARK','GREE','PAYO','PRPL','OSTK',
  'NAKD','AFRM','UPST','LC','DAVE','MOGO','CURO','ELVT','EEFT','IMXI',
  'EVTC','PRAA','ENVA','WRLD','NRDS','RELY','SLQT','STNE','PSFE','RPAY',
  'LMND','LAZR','NVTS','GNOG','OWLET','QNST','RCII','RDFN','STGW','TROO',
  'ZNGA','FUBO','MGNI','OPEN','OUST','TDOC','PTON','THWX','TRIT','ESSC',
  'LOTZ','VLDR','NNDM','UEIC','GPAC','KALI','CEI','ALTO','AMRS','CDEV',
  'CEIX','HTOO','INDO','SWN','RIG','DO','NE','PBF','SBOW','GPRK',
  'TELL','REI','GPRE','CTRN','PRTC','LPTH','GATO','GPL','GFI','HMY',
  'HL','KGC','MAG','MUX','NGD','PAAS','SILV','SSVR','USAS','SAND',
  'GORO','IAUX','SGML','AG','KNT','NOVN','LOVE','MNRO','MODG','PLBY',
  'PRTS','LAZY','BLBD','PETS','CHWY','BBWI','BOOT','CATO','CHUY','CHS',
  'CONN','DLTH','DWIN','ECHO','EDIT','AMCX','LGF','PARA','TTWO','GRIN',
  'ROKU','SBLK','GOGL','EGLE','ESEA','FREE','GASS','GNK','GSL','INSW',
  'KNOP','NM','TOPS','NMCI','SB','PANL','MFIN','NFBK','NRIM','NWBI',
  'NYCB','OFG','ONB','OPBK','OSBC','OVBC','ESSA','HTBK','INBK','LBAI',
  'MBIN','NBTB','OCFC','PFIS','RNST','TBNK','ACCD','ALLO','AMWL','ANGI',
  'HIMS','RCM','MDVX','MNTX','ACHL','ONEM','ASTR','MNTS','RKLB','AST',
  'LUNR','ACHR','JOBY','KTOS','AVAV','LILM','VORB','RDW','CLNC','CMFT',
  'CMRE','CLPR','BXMT','BRSP','SACH','KREF','GPMT','CHMI','LUMN','DISH',
  'GSAT','NTGR','OOMA','IRDM','CALX','SHEN','ALGM','AOSL','DIOD','IMOS',
  'ONTO','RADI','SLAB','SITM','HRMY','HROW','IDRA','IMVT','ITOS','IVAC',
  'JNCE','KALA','KRTX','LASR','LGND','LIFE','LIQT','LMNL','LNTH','LODE',
  'LUNA','LUMO','LWAY','LYRA','MACK','MBIO','MBRX','MCRB','MDXG','MEIP',
  'MGTA','MGTX','MINM','MRIN','MRSN','MRUS','NMRD','NNOX','NRXP','NUVA',
  'NUVW','NYMT','OCRX','OCUP','ONVO','ORGO','ORMP','ORTX','OSUR','OVID',
  'OYST','MMAT','NERV','NUVN','PTGX','PULM','PRTK','PTCT','AQMS','ARAV',
  'AREC','ARKO','ARNC','ARR','ACAD','AGIO','AGTC','AKRO','ALEC','ALGS',
  'ALKS','ALLK','ALNY','ALPN','ALXO','ANAB','ANIP','ANTX','APDN','APLT',
  'AQST','ARAY','ARBE','ARCC','ARCT','ARWR','ASND','ATAI','ATRA','ATRC',
  'ATRS','ATXS','AVEO','AVIR','AVNS','AVRO','BCEL','BCYC','BDTX','BHVN',
  'BLCM','BLDE','BLFS','BLRX','BLTE','BNTX','BPMC','BRTX','CERE','CGON',
  'CRIN','ELVN','EPZM','ERAS','EVOK','FATE','FENC','FREQ','HARP','INMD',
  'IONS','IOVA','IPIX','ISEE','ITCI','JANX','AVDL','AXSM','BCRX','BGNE',
  'BMRN','BOLD','CLDX','CORT','CTLT','CTMX','DVAX','DYAI','ENOB','FOLD',
  'GERN','GNMK','GRTS','GRTX','HALO','HZNP','IBRX','ICAD','IDYA','IMGN',
  'IMMU','INCY','INSM','ISRG','JAZZ','KPTI','KRYS','KYMR','LBPH','LHCG',
  'LOGC','LPCN','LQDA','LTRX','LXEH','LYEL','MDGL','MERUS','MIRM','MNKD',
  'MORF','MREO','MYSZ','NBTX','NTLA','NUVL','NVCR','NVRO','NWBO','NXTC',
  'OMER','OMGA','OPES','OPTN','OTIC','PACB','PAHC','PAVM','PBYI','PCVX',
  'PDYN','PHAT','PHIO','PIRS','PLRX','PMVP','PNTG','POCK','POLA','PRAX',
  'PRCT','PRLD','PROG','PRPH','PRQR','PRTA','PSNL','PTLO','PTPI','PTRS',
  'PUMP','PVBC','PWOD','PXLW','PXMD','PYXS','QCRH','QLYS','RBCN','RCKT',
  'RCUS','RDUS','REGN','RELV','REXR','RGLS','RIGL','RKDA','RLMD','RLYB',
  'RMED','RMMB','RPHM','RPID','RPRX','RRBI','RSSS','RUBY','RVNC','RVPH',
  'RXRX','AKAM','APPN','BAND','BILL','BIGC','BRZE','CFLT','CIEN','COHU',
  'CSGS','DGII','DKNG','DOCU','DUOL','DXPE','DZSI','EGHT','EMKR','ENVX',
  'ERIC','ERII','ETWO','EVBG','EXAS','EXEL','EXLS','EXPI','EXTR','FARO',
  'FFIV','FIVN','FORR','FOUR','FRPT','FSLY','FSLR','FTCI','GDOT','GDRX',
  'GH','GKOS','GLBE','GTLB','HTGC','HTLD','IDCC','IRMD','JAMF','JNPR',
  'KFRC','LLNW','LOGI','LPSN','LRCX','LSPD','LYFT','MARK','MDB','MKSI',
  'MLCO','MODN','MRVL','MSGE','MSRT','MTCH','MTSI','MTTR','NARI','NBIX',
  'NCNO','NDLS','NEGG','NLOK','NTAP','NVEI','NWSA','NXST','OPRA','PAGS',
  'PAYX','PERI','PRFT','PUBM','RAMP','RMBS','RSKD','RSKIA','SMAR','SMCI',
  'SNOW','SPLK','SSYS','SVMK','SWKS','SYBT','SYNH','SYNA','SYRS','TBLA',
  'TENB','TGTX','THMO','TISI','TKLF','TKNO','TLIS','TLND','TMCI','TMDI',
  'TMKR','TNDM','TNXP','TPIC','TRMK','TRMR','TRNC','TRNO','TRNS','TROW',
  'TRUP','TRVG','TRVN','TRXA','TSCO','TSEM','TSHA','TSIN','TSLA','TSRI',
  'TSVT','TTCF','TTEC','TTGT','TTMI','TTNP','TTNW','TTOO','TTPH','TUEM',
  'TUPH','TUSK','TUTO','TVTX','TWLO','TWST','TXMD','TXRH','TYRA','TZOO',
  'UBER','UCTT','UDMY','ULTA','ULTI','ULUS','UMBF','UMRX','UNFI','UNIT',
  'UNTY','UPLD','UPTS','URBN','UROS','URRN','USPH','UTHR','UTRS','UUUU',
  'UVSP','VCNX','VCYT','VERI','VERY','VFFB','VGFC','VGIT','VGLT','VGSH',
  'VGSLV','VGYSX','VIAC','VIAO','VIAP','VIAR','AAME','ABCB','ABTX','ACNB',
  'ACST','FFBC','FBMS','FBNC','FCAP','FCBC','FCBP','FCCO','NCBS','SBFG',
  'SBCF','WSBC','WSFS','BSVN','CBAN','CBFV','CCBG','CCNE','CFBK','CFFI',
  'CFFN','CHMG','CIVB','CLBK','CNOB','COBZ','COWN','CPAC','EBMT','ECPG',
  'EGBN','FBIZ','FFBH','FFBW','GBNK','GBOS','HBCP','HBMD','HBNC','HBOS',
  'HCAT','HCKT','HCSG','HFBL','HFWA','HIFS','HLAN','HLNE','HMST','HNNA',
  'HONE','HOPE','HOVNP','HPNN','HPNW','HRTX','HSII','HSBC','HSCZ','HTBI',
  'HTIA','HTLF','HTMR','HTZZ','HURC','HURN','HWBK','HWKN','HYMC','IBCP',
  'IBEX','IBIO','IBOC','IBTX','ICBK','ICCC','BURL','BGFV','BJRI','BRBR',
  'BRCC','CHEF','CHGG','DNUT','DRVN','ELF','ELFD','EPRT','ESTE','JACK',
  'JAKK','LCUT','PLCE','PLNT','RUTH','SHAK','STKS','VSCO','VSTO','WING',
  'XPOF','YUMM','ZUMZ','GOOS','IRWD','KRUS','LULU','MANU','NFLX','PLAY',
  'REVG','RMBL','RNLX','RRGB','SABR','SAFE','SAGE','SAMA','SAMG','SANA',
  'SANM','SANS','SANW','SAPA','SAPH','SAPX','SARA','SARL','SARN','SARO',
  'SARP','SARQ','SARR','GIII','GXII','HAYW','HELE','HIBB','HLTH','HMHC',
  'HNST','HOST','HOTT','HOUS','HOWL','HRBL','HSDT','HSON','HSTM','HSTO',
  'AMPY','BATL','BCEI','BORR','CIVI','CLMT','CNSL','CRGY','CRIS','CRMT',
  'PTEN','PDCE','REGI','SLB','SLCA','VIST','VALE','GPOR','SDRL','CLNX',
  'CNTX','CODA','CDXS','CDXC','CDXI','CDXM','AES','AGR','ALE','APA',
  'AR','ARE','AROC','ASIX','ATNI','ATRI','ATSG','ATTO','ATVI','ATWS',
  'ATWT','ATXG','BFAM','BKNG','BLDR','BLMN','BMBL','ELME','ELSE','ELST',
  'ELSX','ELTS','ELUP','ELVA','ELWT','ELXN','EPAY','EQNR','EQRX','ETRN',
  'EURN','EVTL','EWBC','AEIS','AEHR','AGCO','AGYS','AIMC','AINV','AIRG',
  'AIXI','AKTS','ALGT','AMKR','AMOT','AMSC','AMTX','APOG','AROW','ARTW',
  'ARUN','ASTE','AVNW','AXDX','AXGN','AZEK','BELFB','BKEN','BMI','BMRA',
  'BMRC','BNFT','BRDG','BRFS','BSIG','BSRR','BUSE','BWXT','CAL','CALC',
  'CALD','CALE','CALF','CALG','CALH','CALI','CALK','CALL','CALM','CALN',
  'CALO','CALP','CALQ','CALR','CALT','CALV','CALW','CAMB','CAMP','CAMS',
  'CANB','CANF','CANG','CANI','CANK','CANN','CANO','CANR','GTES','GTLS',
  'IIIN','IIPR','ILMN','IMAX','INFU','INFN','INSG','INTT','INVA','ITRI',
  'JBLU','ABEV','ARCO','BABA','BAP','BBVA','BIDU','BILI','BZUN','CAAS',
  'CAMT','GRAB','XRAY','WDS','TS','GLOB','MELI','PDD','SE','DESP',
  'VIV','ITUB','BBD','BSBR','SID','GGB','SMFG','MFG','NCLH','KC',
  'LZMO','MOCY','MSEX','MSVB','MTAL','MTBL','MTBC','MTBF','MTBG','MTBH',
  'MTBI','MTBJ','MTBK','ATEX','ATGC','ATGL','ATGO','ATHM','ATIB','ATIF',
  'ATIL','ATIN','ATIP','ATIX','ATJT','ATKO','ATKS','ATLA','ATLI','ATLM',
  'ATLN','ATLO','BRMK','RITM','RWT','PMT','ACRE','COOP','DOOR','EARN',
  'ESRT','EXDI','EXPE','EXRT','AAPL','HASI','NXRT','NXTN','OPRT','ORIT',
  'ORLY','ORMS','ORNC','ORNN','ORNQ','ORNR','ORNS','ORNT','ORNU','ORNV',
  'ORNW','ORNX','ORNY','ORNZ','OROE','OROF','OROG','OROH','OROI','PLYM',
  'PRCH','PRDO','PRGE','PRGO','PRGS','SNDX','STML','STRO','STSA','SURF',
  'SVRA','SYBX','TALO','TARA','TARS','TBPH','TCRR','TCRX','TELA','TILS',
  'TLCR','ACET','ACGS','ACHV','ACLX','ACRV','ACRX','ACRS','NSTG','FIVE',
  'FND','FNKO','FOCS','FOSL','GAIN','GALT','WIRE','XELB','XFOR','SMTC',
  'SMAN','SMIT','SMWB','SNAX','SNBR','SNCE','SNDA','SNEX','SNFCA','SNOA',
  'SNPS','SNRH','SNSE','SPGI','SPOK','SPRC','SPRO','SPRT','SPRB','DSSI',
  'PAR','PARR','ACMR','NXPI','NVST','NURO','WAL','TCBI','CVBF','SFNC',
  'BANR','BPOP','BOKF','CATC','CZWI','DCOM','DGICA','ESXB','FXNC','HAFC',
  'SOUN','SRCE','SRPT','SSBK','SSIC','STAA','STAG','STBA','STCN','STFS',
  'STHO','STIM','STIX','STJM','STLD','STNG','STRM','STRS','STRT','STRW',
  'STWO','STXB','STXS','STYD','STZA','GRPN','ACLS','TREX','TILE','COUR',
  'LAUR','CSV','MATW','FOXF','VITL','HYFM','LNN','AGFS','VERA','VERV',
  'VNDA','VOXX','YMAB','ZFOX','ZAGG','RVLV','SMSI','KNSA','SELB','SEER',
  'SERA','RLAY','XOMA','XNCR','XTNT','XXII','ZNTL','YTRA','DCBO','DCTH',
  'DFIN','DLHC','DLPN','AMRX','ALPP','LOPE','LKFN','LIVN','LOAN','LOCO',
  'LOMA','MFAC','MGYR','MIND','MIRN','MITT','MJCO','MKFG','MKTX','MLNK',
  'MLVF','MMBI','MMEX','MMSI','MODD','MOFG','MOLN','MORN','MOTS','MOTV',
  'ABCL','ABIO','ABUS','ADAP','ADCT','ADGI','ADMP','ADPT','ADXN','AGRX',
  'AHCO','AKLI','AKYA','ALDX','ALHC','ALIM','ALVR','AMEH','AMPH','AMPL',
  'AMRK','AMSWA','AMTB','AMTD','ANIK','APLS','APTO','APVO','ASLN','ACTA',
  'ACTG','ADMS','ADRO','ADSE','AFMD','AFRI','AGBA','AGFY','AGTI','AIMD',
  'ALBO','ALBY','ALRS','ALTG','ALTM','ALUR','ALYA','AMBC','AMMO','ANTE',
  'ANTH','AOGI','AOUT','APGE','ARPO','ASRV','ATAX','AYLA','AYRG','NEPT'
])];
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
  soldCurrentPrices: {}, // ticker → current price
  loading: false,
  _confirmCb: null,
  masterList: [],
  masterListUpdated: null,
};

function loadState() {
  ['settings','portfolio','sold','signals','lastScanTime','news','signalToggles','masterList','masterListUpdated'].forEach(k => {
    const raw = localStorage.getItem('edge_' + k);
    if (raw) { try { state[k] = JSON.parse(raw); } catch(e) {} }
  });
  state.settings = Object.assign({
    alpacaKey: '', alpacaSecret: '', groqKey: '',
    budget: 500, includeUnder2: false, showWatch: true, minVolume: 100000
  }, state.settings);
  state.signalToggles = Object.assign(
    { strongBuy: true, softBuy: true, watch: true },
    state.signalToggles
  );
  // Always scan MASTER_TICKERS; merge any extras discovered via Refresh List on top
  TICKERS = state.masterList && state.masterList.length
    ? [...new Set([...MASTER_TICKERS, ...state.masterList])]
    : MASTER_TICKERS;
}

function persist(key) {
  try { localStorage.setItem('edge_' + key, JSON.stringify(state[key])); } catch(e) {}
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

function updateMasterListBanner() {
  const el = document.getElementById('master-list-banner');
  if (!el) return;
  const ts = state.masterListUpdated;
  const shouldShow = !ts || (Date.now() - ts) >= (30 * 24 * 60 * 60 * 1000);
  if (!shouldShow) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.innerHTML = `
    <span>Your stock list is 30 days old. Tap Refresh List to scan for newly active stocks.</span>
    <div class="master-list-banner-btns">
      <button class="btn btn-warn btn-sm master-refresh-btn" onclick="refreshMasterList()">Refresh List</button>
      <button class="btn-dismiss" onclick="dismissMasterListBanner()">✕</button>
    </div>
  `;
}

function dismissMasterListBanner() {
  const el = document.getElementById('master-list-banner');
  if (el) el.classList.add('hidden');
}

async function refreshMasterList() {
  if (!state.settings.alpacaKey || !state.settings.alpacaSecret) {
    alert('Set your Alpaca API keys in Settings first.');
    return;
  }

  document.querySelectorAll('.master-refresh-btn').forEach(b => {
    b.disabled = true; b.textContent = 'Refreshing…';
  });

  try {
    const currentList = (state.masterList && state.masterList.length)
      ? state.masterList : MASTER_TICKERS;

    // 1. Fetch snapshots to identify stale tickers (no activity in 30 days)
    const snapshots = await fetchSnapshots(currentList);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staleTickers = [];
    const activeTickers = [];
    currentList.forEach(ticker => {
      const snap = snapshots[ticker];
      if (!snap) { staleTickers.push(ticker); return; }
      const price = snap.dailyBar?.c || snap.latestTrade?.p || 0;
      const volume = snap.dailyBar?.v || 0;
      const barTime = snap.dailyBar?.t ? new Date(snap.dailyBar.t) : null;
      if (!barTime || barTime < thirtyDaysAgo || price < 0.50 || volume === 0) {
        staleTickers.push(ticker);
      } else {
        activeTickers.push(ticker);
      }
    });

    // 2. Find newly active stocks via Alpaca most-actives screener
    let newTickers = [];
    try {
      const data = await alpacaGet('/screener/stocks/most-actives', { by: 'volume', top: 100 });
      const mostActives = data.most_actives || [];
      const symbols = mostActives.map(s => s.symbol).filter(Boolean);
      if (symbols.length) {
        const newSnaps = await fetchSnapshots(symbols);
        const currentSet = new Set(currentList);
        newTickers = symbols.filter(sym => {
          if (currentSet.has(sym)) return false;
          const snap = newSnaps[sym];
          if (!snap) return false;
          const price = snap.dailyBar?.c || snap.latestTrade?.p || 0;
          return price >= 1 && price <= 20;
        });
      }
    } catch(e) { console.warn('Screener endpoint unavailable:', e.message); }

    // 3. Build updated list and persist
    const updatedList = [...activeTickers, ...newTickers];
    const addedCount = newTickers.length;
    const removedCount = staleTickers.length;

    newTickers.forEach(t => { if (!COMPANY_NAMES[t]) COMPANY_NAMES[t] = t; });

    state.masterList = updatedList;
    state.masterListUpdated = Date.now();
    TICKERS = [...new Set([...MASTER_TICKERS, ...updatedList])];
    persist('masterList');
    persist('masterListUpdated');

    updateMasterListBanner();

    // 4. Show summary
    const total = updatedList.length;
    showModal(`
      <div class="modal-header">
        <h2 class="modal-title">List Updated</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-scroll">
        <p style="color:var(--text-dim);font-size:13px;margin-bottom:8px">
          List updated — added ${addedCount} new tickers, removed ${removedCount} stale tickers. Total active: ${total}
        </p>
        <div class="refresh-summary">
          <div class="refresh-stat">
            <span class="refresh-num pos">+${addedCount}</span>
            <span class="refresh-label">new tickers added</span>
          </div>
          <div class="refresh-stat">
            <span class="refresh-num neg">-${removedCount}</span>
            <span class="refresh-label">stale tickers removed</span>
          </div>
          <div class="refresh-stat refresh-total">
            <span class="refresh-label">Total active: <strong>${total}</strong></span>
          </div>
        </div>
        <button class="btn btn-primary btn-full" onclick="closeModal()">Done</button>
      </div>
    `);

  } catch(e) {
    console.error('Master list refresh error:', e);
    alert('Refresh failed: ' + e.message);
  } finally {
    document.querySelectorAll('.master-refresh-btn').forEach(b => {
      b.disabled = false; b.textContent = 'Refresh List';
    });
  }
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

// ── 7. GROQ API ───────────────────────────────────────────────────

async function groqAnalyze(stock) {
  const key = state.settings.groqKey;
  if (!key) throw new Error('No Groq key');

  if (state.aiCache[stock.ticker]) return state.aiCache[stock.ticker];

  const prompt = buildAIPrompt(stock);
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

  const result = parseAIResponse(text);
  state.aiCache[stock.ticker] = result;
  return result;
}

function buildAIPrompt(s) {
  const durLabel = durBadgeText(s.duration);
  return `You are a short-term trading analyst helping a retail investor decide whether to buy a stock right now. Be direct, specific and actionable. No disclaimers.

Stock: ${s.ticker} (${s.company || s.ticker})
Current Price: $${s.price.toFixed(2)}
Today's Change: ${s.todayChange.toFixed(2)}%
RSI (14-day): ${s.rsi.toFixed(1)}
Volume vs 10-day average: ${s.volRatio.toFixed(2)}x
Price vs 20-day MA: ${s.price > s.ma20 ? 'ABOVE' : 'BELOW'}
Signal Score: ${s.score}/100
Risk Level: ${s.risk}/10
Trade Duration: ${durLabel}
Price Range: ${s.priceRange}
Recent news: ${s.news ? s.news.headline : 'none'}
Entry: $${s.entry.toFixed(2)} | Target: $${s.target.toFixed(2)} | Stop-loss: $${s.stop.toFixed(2)}
Volume Build detected: ${s.volBuild ? 'YES' : 'NO'}
Mean Reversion setup: ${s.meanReversion ? 'YES' : 'NO'}

Respond with exactly 3 bullet points in this exact format:

- BUY NOW OR WAIT: Tell the investor whether to buy right now at the current price or wait, and specifically what to wait for if waiting is recommended. Be decisive.

- RISKS: List the 2-3 most important risks specific to this trade right now. Include how bad it could get if the stop-loss is hit.

- SIGNALS FOR vs AGAINST: List which signals are working in favor of this trade and which are working against it. Be specific about the numbers.

Keep each bullet point to 2-3 sentences maximum. Be direct like a trader talking to another trader.`;
}

function parseAIResponse(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const bullets = [];
  let tip = '';
  let inTip = false;

  for (const line of lines) {
    if (/strategy tip/i.test(line)) { inTip = true; continue; }
    if (inTip) { tip += (tip ? ' ' : '') + line.replace(/^[-•*]\s*/, ''); continue; }
    if (/^[-•*\d]/.test(line) && bullets.length < 3) {
      bullets.push(line.replace(/^[-•*\d.]+\s*/, ''));
    }
  }

  if (!tip && bullets.length > 3) tip = bullets.splice(3).join(' ');
  return { bullets: bullets.slice(0, 3), tip };
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

function calcEntryTargetStop(price, atr, duration) {
  const entry = price;
  const atrFloor = Math.max(atr, price * 0.02); // minimum 2% of price
  let tMult, sMult;
  switch (duration) {
    case 'DAY':   tMult = 1.0; sMult = 0.75; break;
    case '3-DAY': tMult = 2.0; sMult = 1.0;  break;
    case 'WEEK':  tMult = 3.5; sMult = 1.5;  break;
    default:      tMult = 1.5; sMult = 1.0;
  }
  return {
    entry,
    target: Math.max(entry + atrFloor * tMult, entry * 1.02),
    stop:   Math.min(entry - atrFloor * sMult, entry * 0.95)
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

function scoreStock(ticker, snap, bars, newsItem) {
  const price = snap.dailyBar?.c || snap.latestTrade?.p || 0;
  const prevClose = snap.prevDailyBar?.c || price;
  const volume = snap.dailyBar?.v || 0;

  if (bars.length < 15) return null;

  const sorted = [...bars].sort((a,b) => new Date(a.t) - new Date(b.t));
  const closes = sorted.map(b => b.c);
  const vols   = sorted.map(b => b.v);

  const rsi = calcRSI(closes);
  const atr = calcATR(sorted);
  const ma20 = calcMA(closes, 20);
  const avgVol10 = calcAvgVolume(vols, 10);
  const volRatio = avgVol10 > 0 ? volume / avgVol10 : 1;
  const todayChange = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;

  const duration = classifyDuration(rsi, volRatio, closes);
  const { entry, target, stop } = calcEntryTargetStop(price, atr, duration);

  let score = 0;
  // Volume spike (0–30)
  if (volRatio >= 3) score += 30;
  else if (volRatio >= 2) score += 20;
  else if (volRatio >= 1.5) score += 10;
  // Price momentum (0–20)
  if (todayChange >= 4) score += 20;
  else if (todayChange >= 2) score += 10;
  // RSI (0–20)
  if (rsi >= 50 && rsi <= 65) score += 20;
  else if (rsi > 65 && rsi <= 75) score += 10;
  else if (rsi < 45 && closes.length >= 5 && closes[closes.length-1] > closes[closes.length-5]) score += 15;
  // Above 20-day MA
  if (price > ma20) score += 10;
  // News
  let hasNegNews = false;
  if (newsItem) {
    const hl = (newsItem.headline || '').toLowerCase();
    hasNegNews = NEG_KEYWORDS.some(kw => hl.includes(kw));
    if (hasNegNews) {
      score -= 10;
    } else {
      const ageH = (Date.now() - new Date(newsItem.created_at).getTime()) / 3600000;
      if (ageH < 4) score += 20;
      else if (ageH < 12) score += 10;
    }
  }

  // Volume Build: 3 consecutive days of rising volume + today >= 1.3x avg (0–15)
  let volBuild = false;
  if (vols.length >= 4 && volRatio >= 1.3) {
    const n = vols.length;
    if (vols[n-1] > vols[n-2] && vols[n-2] > vols[n-3]) {
      volBuild = true;
      score += 15;
    }
  }

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

  const signalsFired = [];
  if (volBuild) signalsFired.push('VOL_BUILD');
  if (meanReversion) signalsFired.push('MEAN_REVERSION');

  const volTrend = volBuild ? 'building' : volRatio >= 1.5 ? 'spike' : 'normal';

  score = Math.max(0, Math.min(100, score));
  const risk = calcRiskScore(price, atr, rsi, volRatio, hasNegNews);
  const priceRange = price <= 3 ? '$1–$3' : price <= 9 ? '$4–$9' : '$10–$20';
  const signal = score >= 70 ? 'STRONG BUY' : score >= 50 ? 'SOFT BUY' : 'WATCH';

  return {
    ticker, company: COMPANY_NAMES[ticker] || ticker,
    price, prevClose, todayChange, volume, volRatio,
    rsi, atr, ma20, duration, entry, target, stop,
    score, risk, signal, priceRange, news: newsItem, hasNegNews,
    volBuild, meanReversion, maPct, volTrend, signalsFired,
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
    // 1. Batch snapshots
    const snapshots = await fetchSnapshots(TICKERS, updateScanProgress);

    // 2. Filter price + volume
    const minVol = state.settings.minVolume || 100000;
    const minPrice = state.settings.includeUnder2 ? 1 : 1;
    const candidates = Object.entries(snapshots).filter(([, snap]) => {
      const p = snap.dailyBar?.c || snap.latestTrade?.p || 0;
      const v = snap.dailyBar?.v || 0;
      return p >= minPrice && p <= 20 && v >= minVol;
    });

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

    // 5. Pre-market movers (if applicable)
    if (isPreMarketHours()) {
      await computePreMarketMovers(snapshots, candidates.slice(0, 20));
    }

    // 6. Score
    const scored = candidates.map(([ticker, snap]) => {
      const bars = allBars[ticker] || [];
      return scoreStock(ticker, snap, bars, newsMap[ticker] || null);
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
    TICKERS = state.masterList && state.masterList.length
      ? [...new Set([...MASTER_TICKERS, ...state.masterList])]
      : MASTER_TICKERS;
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
    const sb  = state.signals.filter(s => s.signal === 'STRONG BUY').length;
    const sfb = state.signals.filter(s => s.signal === 'SOFT BUY').length;
    const w   = state.signals.filter(s => s.signal === 'WATCH').length;
    const total = TICKERS.length;
    html += `<div class="scan-summary">Scanned ${total} stocks — <span class="ss-strong">${sb} strong buy</span>, <span class="ss-soft">${sfb} soft buy</span>, <span class="ss-watch">${w} watch</span></div>`;

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
  return `
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
  const sigBadges = (s.volBuild || s.meanReversion) ? `
    <div class="signal-extra-badges">
      ${s.volBuild      ? '<span class="badge badge-vol-build">VOL BUILD</span>' : ''}
      ${s.meanReversion ? '<span class="badge badge-reversal">REVERSAL</span>'  : ''}
    </div>` : '';

  return `
    <div class="stock-card" onclick="openStockModal('${s.ticker}')">
      ${overlay}
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
  let volPts = 0;
  if (s.volRatio >= 3) volPts = 30;
  else if (s.volRatio >= 2) volPts = 20;
  else if (s.volRatio >= 1.5) volPts = 10;

  let momPts = 0;
  if (s.todayChange >= 4) momPts = 20;
  else if (s.todayChange >= 2) momPts = 10;

  let rsiPts = 0;
  if (s.rsi >= 50 && s.rsi <= 65) rsiPts = 20;
  else if (s.rsi > 65 && s.rsi <= 75) rsiPts = 10;
  else if (s.rsi < 45) rsiPts = 15;

  const maPts = s.price > s.ma20 ? 10 : 0;

  let newsPts = 0, sentPts = 0;
  if (s.news) {
    const ageH = (Date.now() - new Date(s.news.created_at).getTime()) / 3600000;
    if (s.hasNegNews) { sentPts = -10; }
    else if (ageH < 4) newsPts = 20;
    else if (ageH < 12) newsPts = 10;
  }

  const volBuildPts = s.volBuild ? 15 : 0;
  const meanRevPts  = s.meanReversion ? 20 : 0;
  const newsAge     = s.news ? newsTimeAgo(s.news) : null;

  return [
    { key: 'vol',    short: 'vol',      label: `Volume spike (${s.volRatio.toFixed(1)}× avg)`,                                 pts: volPts,     fired: volPts > 0 },
    { key: 'mom',    short: 'momentum', label: `Price momentum (${s.todayChange>=0?'+':''}${s.todayChange.toFixed(1)}% today)`, pts: momPts,     fired: momPts > 0 },
    { key: 'rsi',    short: 'RSI',      label: `RSI position (${s.rsi.toFixed(0)})`,                                           pts: rsiPts,     fired: rsiPts > 0 },
    { key: 'ma',     short: 'MA',       label: `Above 20-day MA ($${s.ma20.toFixed(2)})`,                                      pts: maPts,      fired: maPts > 0 },
    { key: 'news',   short: 'news',     label: newsAge ? `Recent news (${newsAge})` : 'Recent news',                           pts: newsPts,    fired: newsPts > 0 },
    { key: 'sent',   short: 'sentiment',label: s.hasNegNews ? 'News sentiment (negative)' : 'News sentiment',                  pts: sentPts,    fired: false },
    { key: 'vbuild', short: 'vol build',label: `Volume build (3 days rising)`,                                                 pts: volBuildPts, fired: volBuildPts > 0 },
    { key: 'rev',    short: 'reversal', label: `Mean reversion`,                                                               pts: meanRevPts, fired: meanRevPts > 0 },
  ];
}

function buildScoreBreakdown(s) {
  const rows = computeScoreBreakdown(s);
  const id   = `sb-${s.ticker}`;

  const top2    = rows.filter(r => r.pts > 0).sort((a,b) => b.pts - a.pts).slice(0, 2);
  const preview = top2.length ? ' · ' + top2.map(r => `${r.short} +${r.pts}`).join(', ') : '';

  const rowsHtml = rows.map(r => {
    const ptsCls = r.pts > 0 ? 'sb-pos' : r.pts < 0 ? 'sb-neg' : 'sb-zero';
    const ptsStr = r.pts > 0 ? `+${r.pts}` : `${r.pts}`;
    return `<div class="sb-row">
      <span class="sb-check ${r.fired ? 'sb-chk-yes' : 'sb-chk-no'}">${r.fired ? '✓' : '✗'}</span>
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
    return `<div class="sb-row msb-row">
      <span class="sb-check ${r.fired ? 'sb-chk-yes' : 'sb-chk-no'}">${r.fired ? '✓' : '✗'}</span>
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

async function openStockModal(ticker) {
  const s = state.signals.find(x => x.ticker === ticker);

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
    const rsi     = calcRSI(closes);
    const atr     = calcATR(sorted);
    const ma20    = calcMA(closes, 20);
    const avgVol10 = calcAvgVolume(vols, 10);
    const volRatio = avgVol10 > 0 ? ((sorted[sorted.length-1]?.v||0) / avgVol10) : 1;

    const last252 = sorted.slice(-252);
    const high52  = last252.length ? Math.max(...last252.map(b => b.h)) : price;
    const low52   = last252.length ? Math.min(...last252.map(b => b.l)) : price;

    const stock = s || {
      ticker, company: COMPANY_NAMES[ticker]||ticker,
      price, rsi, atr, ma20, volRatio, bars: sorted,
      duration: classifyDuration(rsi, volRatio, closes),
      ...calcEntryTargetStop(price, atr, classifyDuration(rsi, volRatio, closes)),
      score: 0, risk: calcRiskScore(price, atr, rsi, volRatio, false),
      priceRange: price <= 3 ? '$1–$3' : price <= 9 ? '$4–$9' : '$10–$20',
      todayChange: 0, signal: 'WATCH', news: null
    };

    const chgCls  = stock.todayChange >= 0 ? 'change-pos' : 'change-neg';
    const chgSign = stock.todayChange >= 0 ? '▲' : '▼';
    const durBadge = durBadgeClass(stock.duration);
    const sigBadge = sigBadgeClass(stock.signal);
    const riskCls  = stock.risk <= 3 ? 'risk-low' : stock.risk <= 6 ? 'risk-mid' : 'risk-hi';

    const rsiLabel = stock.rsi > 75 ? 'Overbought — caution'
      : stock.rsi < 35 ? 'Oversold bounce setup'
      : stock.rsi > 60 ? 'Bullish momentum'
      : 'Neutral';

    const durWhy = stock.duration === 'DAY'
      ? 'RSI elevated or volume spike detected — quick exit expected'
      : stock.duration === 'WEEK'
      ? 'RSI moderate with upward trend and steady volume — patient setup'
      : 'Moderate RSI with volume confirmation — medium-term swing';

    const upside =((stock.target - stock.price) / stock.price * 100).toFixed(1);
    const downside = ((stock.stop - stock.price) / stock.price * 100).toFixed(1);

    document.getElementById('stock-modal-body').innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
        <span class="price-mono" style="font-size:20px">$${price.toFixed(2)}</span>
        <span class="${chgCls}">${chgSign}${Math.abs(stock.todayChange).toFixed(1)}%</span>
        <span class="badge ${sigBadge}">${stock.signal} ${stock.score}</span>
        <span class="badge ${durBadge}">${durBadgeText(stock.duration)}</span>
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
          <div class="level-cell-val">$${stock.entry.toFixed(2)}</div>
        </div>
        <div class="level-cell">
          <div class="level-cell-label">Target (▲${upside}%)</div>
          <div class="level-cell-val pos">$${stock.target.toFixed(2)}</div>
        </div>
        <div class="level-cell">
          <div class="level-cell-label">Stop-Loss (${downside}%)</div>
          <div class="level-cell-val neg">$${stock.stop.toFixed(2)}</div>
        </div>
        <div class="level-cell">
          <div class="level-cell-label">20-Day MA</div>
          <div class="level-cell-val">$${stock.ma20.toFixed(2)}</div>
        </div>
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
      ${stock.meanReversion ? `<div class="signal-row">
        <span class="signal-key">Mean Reversion</span>
        <span class="signal-val" style="color:var(--purple);font-size:11px;max-width:60%;text-align:right">Oversold bounce setup — price significantly below average and momentum turning up</span>
      </div>` : ''}
      <div class="signal-row">
        <span class="signal-key">Duration</span>
        <span class="signal-val">${durBadgeText(stock.duration)} — ${durWhy}</span>
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
        <button class="btn btn-sm btn-primary" onclick="loadAIAnalysis('${ticker}')">Get AI Analysis</button>
      </div>
    `;

    document.getElementById('stock-modal-footer').innerHTML = `
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
  let sig = state.signals.find(s => s.ticker === ticker);

  if (!sig) {
    const pos = state.portfolio.find(p => p.ticker === ticker);
    if (!pos) return;
    const currentPrice = state.portfolioPrices[ticker] || pos.buyPrice;
    sig = {
      ticker: pos.ticker,
      company: pos.company,
      price: currentPrice,
      todayChange: 0,
      rsi: pos.rsiAtBuy || 50,
      volRatio: pos.volRatioAtBuy || 1,
      ma20: currentPrice,
      score: pos.scoreAtBuy || 0,
      risk: pos.riskAtBuy || 5,
      duration: pos.duration,
      priceRange: currentPrice <= 3 ? '$1–$3' : currentPrice <= 9 ? '$4–$9' : '$10–$20',
      entry: pos.buyPrice,
      target: pos.target,
      stop: pos.stop,
      volBuild: false,
      meanReversion: false,
      news: pos.newsAtBuy ? { headline: pos.newsAtBuy } : null,
    };
  }

  const sec = document.getElementById('ai-section');
  if (!sec) return;
  sec.innerHTML = `<div class="ai-title">AI Analysis</div><div class="ai-loading"><span class="spinner"></span> Analyzing with Groq…</div>`;

  try {
    const result = await groqAnalyze(sig);
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
  result.bullets.forEach(b => { html += `<div class="ai-bullet">• ${b}</div>`; });
  if (result.tip) html += `<div class="ai-tip"><strong>Strategy Tip:</strong> ${result.tip}</div>`;
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
    peakPrice:   price,
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
    const atr = bars.length >= 15 ? calcATR(bars) : 0;

    // Update peak
    if (currentPrice > (p.peakPrice || 0)) {
      p.peakPrice = currentPrice;
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
      <div class="card-sub">
        Target $${p.target.toFixed(2)} · Stop $${p.stop.toFixed(2)} · RSI ${rsi.toFixed(0)}
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

  // SELL NOW conditions
  if (currentPrice <= position.stop) return 'SELL_NOW';
  if (rsi > 78) return 'SELL_NOW';
  if (pnlPct <= -8) return 'SELL_NOW';
  if (position.duration === 'DAY' && ptMin >= 720 && isTradingDay(pt)) return 'SELL_NOW'; // past 12pm

  // SELL SOON conditions
  const toTarget = currentPrice >= position.target * 0.97;
  if (toTarget) return 'SELL_SOON';
  if (rsi >= 72) return 'SELL_SOON';
  if (position.duration === '3-DAY' && days >= 4) return 'SELL_SOON';
  if (position.duration === 'WEEK' && days >= 7) return 'SELL_SOON';

  // Peak give-back (more than half of peak gain given back)
  const peakGain = position.peakPrice - position.buyPrice;
  if (peakGain > 0) {
    const currentGain = currentPrice - position.buyPrice;
    if (currentGain < peakGain * 0.5) return 'SELL_SOON';
  }

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

function buildPortfolioBanner(p, currentPrice, rsi, pnlDollar, pnlPct, days) {
  const pt = getPT();
  const ptMin = pt.getHours() * 60 + pt.getMinutes();

  // SELL NOW
  if (currentPrice <= p.stop)
    return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — Price hit stop-loss</div>`;
  if (rsi > 78)
    return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — RSI ${rsi.toFixed(0)} — extremely overbought</div>`;
  if (pnlPct <= -8)
    return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — Down 8%+ from purchase</div>`;
  if (p.duration === 'DAY' && ptMin >= 720 && isTradingDay(pt))
    return `<div class="port-banner port-sell-now"><strong>🔴 SELL NOW</strong> — Day trade — exit before close</div>`;

  // DANGER — within 3% of stop-loss
  const distToStop = ((currentPrice - p.stop) / currentPrice) * 100;
  if (distToStop > 0 && distToStop <= 3)
    return `<div class="port-banner port-danger"><strong>⚠️ DANGER — NEAR STOP-LOSS</strong> — Stop-loss at $${p.stop.toFixed(2)} — price is ${distToStop.toFixed(1)}% away. Consider exiting.</div>`;

  // SELL SOON — within 5% of target
  const distToTarget = ((p.target - currentPrice) / p.target) * 100;
  if (distToTarget >= 0 && distToTarget <= 5)
    return `<div class="port-banner port-sell-soon"><strong>🟠 SELL SOON — TAKE PROFITS</strong> — Target $${p.target.toFixed(2)} — you are ${distToTarget.toFixed(1)}% away</div>`;

  // HOLD ON TRACK (profitable)
  if (pnlDollar >= 0)
    return `<div class="port-banner port-hold-track"><strong>✅ HOLD — ON TRACK</strong> — Up $${pnlDollar.toFixed(2)} (+${pnlPct.toFixed(1)}%) — holding strong</div>`;

  // HOLD RECOVERING (negative but not at stop)
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
    duration: pos.duration,
    priceRange: salePrice <= 3 ? '$1–$3' : salePrice <= 9 ? '$4–$9' : '$10–$20',
    sellWarningAtSale: currentWarn,
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
  ${scoreStats(50,60)}
  ${scoreStats(61,70)}
  ${scoreStats(71,80)}
  ${scoreStats(81,100)}

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

Scoring System (0–100 points, capped at 100):
  Volume spike:     0–30 pts (1.5x=10, 2x=20, 3x+=30)
  Volume build:     0–15 pts (3 consecutive days rising + today >=1.3x avg)
  Price momentum:   0–20 pts (2-4%=10, 4%+=20)
  RSI position:     0–20 pts (50-65=20, 65-75=10, <45 rising=15)
  Above 20-day MA:  10 pts
  Recent news:      0–20 pts (<4hrs=20, 4-12hrs=10, negative=-10)
  Mean reversion:   0–20 pts (price 8-15% below MA, RSI<45, RSI turning up)

Labels: 70–100=STRONG BUY | 50–69=SOFT BUY | 20–49=WATCH | <20=excluded

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
        <div class="score-row"><span>Recent news boost</span><span>0–20 pts</span></div>
        <div class="score-row"><span>Mean reversion setup</span><span>+20 pts</span></div>
        <div class="score-row score-row-total"><span>Total (capped)</span><span>100 pts</span></div>
        <div class="score-row"><span class="score-label-strong">STRONG BUY</span><span>70–100</span></div>
        <div class="score-row"><span class="score-label-soft">SOFT BUY</span><span>50–69</span></div>
        <div class="score-row"><span class="score-label-watch">WATCH</span><span>20–49</span></div>
      </div>
    </div>

    <div class="settings-section mt12">
      <div class="settings-section-title">Screener Health</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Ticker Coverage</div>
          <div class="settings-hint">Master list: ${MASTER_TICKERS.length} tickers — all scanned on every Refresh</div>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Last List Refresh</div>
          <div class="settings-hint">
            ${state.masterListUpdated
              ? `${Math.floor((Date.now()-state.masterListUpdated)/86400000)}d ago`
              : 'Never refreshed — tap to scan for newly active stocks'}
          </div>
        </div>
        <button class="btn btn-warn btn-sm master-refresh-btn" onclick="refreshMasterList()">Refresh List</button>
      </div>
    </div>

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
    ['settings','portfolio','sold','signals','lastScanTime','news','masterList','masterListUpdated'].forEach(k => {
      localStorage.removeItem('edge_' + k);
    });
    TICKERS = MASTER_TICKERS;
    loadState();
    renderSettingsTab();
    updateNavBadges();
    alert('All data cleared.');
  });
}

// ── 21. NAVIGATION ────────────────────────────────────────────────

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

// ── 22. CLOCK / REFRESH ───────────────────────────────────────────

function startClock() {
  updateMarketBanner();
  updateNavBadges();
  setInterval(() => {
    updateMarketBanner();
    updateNavBadges();
  }, 30000); // every 30 seconds
}

// ── 23. INIT ─────────────────────────────────────────────────────

function init() {
  loadState();
  startClock();
  updateMasterListBanner();
  renderSignalsTab();
  updateNavBadges();
}

init();
