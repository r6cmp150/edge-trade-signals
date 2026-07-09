'use strict';
// ================================================================
// EDGE Trade Signals — app.js  v1.2.0
// ================================================================

// ── 1. CONSTANTS ────────────────────────────────────────────────

const VERSION = 'v1.2.0';
const ALPACA_BASE = 'https://data.alpaca.markets/v2';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ── STOCK UNIVERSES ──────────────────────────────────────────────
const STOCK_UNIVERSES = {
  BIOTECH: [...new Set([
  // ── A: clinical-stage, small pharma ───────────────────────────────
  'AADI','ABCL','ABEO','ABIO','ABUS','ACAD','ACER','ACHV','ACOR','ACRX',
  'ACRS','ACST','ACET','ADCT','ADGI','ADMA','ADMP','ADMS','ADPT','ADTX',
  'ADVM','ADXN','AFMD','AGIO','AGRX','AHCO','AIMD','AKBA','AKLI','AKRO',
  'AKYA','ALBO','ALEC','ALGS','ALIM','ALHC','ALLK','ALNY','ALPN','ALRN',
  'ALVR','AMEH','AMPH','AMRN','AMRS','AMRX','ANIK','ANNX','ANTX','ANVS',
  'APDN','APGE','APLS','APLT','APTO','APVO','APYX','AQST','ARAV','ARBE',
  'ARCT','ARDX','ARGX','ARQT','ARWR','ARVN','ASLN','ASMB','ASND','ASRT',
  'ATAI','ATHA','ATNF','ATRC','ATRS','ATXI','ATXS','AURA','AUPH','AVDL',
  'AVEO','AVIR','AVNS','AVRO','AVXL','AXDX','AXGN','AXLA','AXNX','AXSM',
  'AYLA','AYTU','AZRX',
  // ── B ────────────────────────────────────────────────────────────
  'BCAB','BCEL','BCYC','BCRX','BDTX','BEAM','BFRI','BGNE','BHVN','BFLY',
  'BIOL','BIVI','BLCM','BLDE','BLFS','BLPH','BLRX','BLTE','BLUE','BNGO',
  'BNTC','BNTX','BOLD','BPMC','BPTH','BRKR','BRTX','BTAI','BXRX','BYSI',
  // ── C ────────────────────────────────────────────────────────────
  'CAPR','CARA','CASI','CBMG','CBPO','CCCC','CCXI','CDMO','CDNA','CEMI',
  'CERT','CGEM','CGEN','CGON','CKPT','CLBS','CLSD','CLVS','CLPT','CMPS',
  'CNCE','CNMD','CNTX','COCP','CODX','CPHI','CPRX','CRBU','CRDF','CRNX',
  'CRSP','CRTX','CRVS','CSII','CTLT','CTMX','CTXR','CYCN','CYTO','CYTX',
  // ── D ────────────────────────────────────────────────────────────
  'DBVT','DCPH','DCTH','DFFN','DMAC','DNLI','DOVA','DRMA','DVAX','DXCM',
  'DYAI',
  // ── E ────────────────────────────────────────────────────────────
  'EDIT','EDSA','ELOX','ENOB','ENOV','EPZM','ERAS','ESPR','ETNB','EVOK',
  'EWTX','EXAS','EXEL',
  // ── F ────────────────────────────────────────────────────────────
  'FBIO','FATE','FBTX','FENC','FGEN','FHTX','FLGT','FNCH','FOLD','FREQ',
  'FULC',
  // ── G ────────────────────────────────────────────────────────────
  'GBIO','GERN','GKOS','GLMD','GMAB','GNMK','GOVX','GRPH','GRTS','GRTX',
  'GTHX',
  // ── H ────────────────────────────────────────────────────────────
  'HALO','HARP','HCAT','HEPA','HIMS','HOOK','HRMY','HROW','HRTX','HTGM',
  'HZNP',
  // ── I ────────────────────────────────────────────────────────────
  'IBRX','IBIO','ICAD','IDYA','ILMN','IMAB','IMGU','IMMP','IMMU','IMNM',
  'IMRX','IMTX','IMVT','INAB','INCY','INFI','INMD','INOG','INSP','INSM',
  'IONS','IOVA','IPIX','IPSC','ISEE','ISRG','ITCI','ITRM','IVAC','ITOS',
  // ── J-K ──────────────────────────────────────────────────────────
  'JANX','JAZZ','JNCE','KALA','KDNY','KMPH','KNSA','KROS','KRYS','KRTX',
  'KYMR','KPTI',
  // ── L ────────────────────────────────────────────────────────────
  'LASR','LBPH','LEGN','LENZ','LGND','LHCG','LIFE','LIQT','LMNL','LNTH',
  'LODE','LOGC','LPCN','LQDA','LUNA','LUMO','LUNG','LYEL','LYRA',
  // ── M ────────────────────────────────────────────────────────────
  'MACK','MASI','MBIO','MBRX','MCRB','MDGL','MDXG','MEIP','MELA','MESO',
  'MERUS','MGTA','MGTX','MGNX','MIRM','MNKD','MNMD','MNOV','MORF','MREO',
  'MRNA','MRSN','MRUS','MMSI',
  // ── N ────────────────────────────────────────────────────────────
  'NARI','NBTX','NDRA','NERV','NKTR','NMRA','NNOX','NOVN','NPCE','NRIX',
  'NRXP','NSTG','NTRB','NTLA','NUVL','NUVN','NVCN','NVCR','NVNS','NVRO',
  'NVST','NVTA','NWBO','NXTC',
  // ── O ────────────────────────────────────────────────────────────
  'OCGN','OCRX','OCUL','OCUP','OFIX','OGEN','OMCL','OMGA','OMER','ONVO',
  'OPTH','OPTN','ORIC','ORGO','ORMP','OTIC','OVID','OWLT','OYST',
  // ── P ────────────────────────────────────────────────────────────
  'PACB','PASG','PAVM','PBYI','PCVX','PDCO','PDYN','PHAT','PHIO','PHVS',
  'PIRS','PLRX','PMVP','POLA','PODD','PRAX','PRGO','PRLD','PROG','PRPH',
  'PRPO','PRQR','PRTA','PSNL','PTCT','PTGX','PULM','PRTK','PDSB','PYXS',
  // ── Q-R ──────────────────────────────────────────────────────────
  'QLGN','QNRX','QURE','RBGV','RCKT','RCUS','RDUS','REGN','RGEN','RGLS',
  'RIGL','RKDA','RLMD','RLAY','RLYB','RMED','RMMB','RPHM','RPID','RUBY',
  'RVMD','RVNC','RVPH','RXRX','RARE',
  // ── S ────────────────────────────────────────────────────────────
  'SANA','SEER','SELB','SGEN','SGMO','SIGA','SLDB','SNDX','SOLID','SPPI',
  'SRNE','SRPT','SRRK','STAA','STOK','STRO','STSA','STTK','SURF','SVRA',
  'SYBX',
  // ── T ────────────────────────────────────────────────────────────
  'TALO','TARA','TARO','TARS','TBPH','TCRR','TCRX','TELA','TGTX','THMO',
  'TILS','TLCR','TNDM','TNXP','TRMR','TRVN','TSHA','TSIN','TSVT','TTOO',
  'TTPH','TUPH','TVTX','TWST','TXMD','TYRA',
  // ── U-Z ──────────────────────────────────────────────────────────
  'UMRX','UROS','UTHR','VCNX','VCYT','VBIV','VERA','VERV','VNDA','VRNA',
  'VRTX','VNRX','XBIO','XNCR','XOMA','XTNT','XXII','YMAB','YTRA','ZNTL',
  'ZSAN','ZYBT',
  // ── Genomics / CRISPR / RNA ──────────────────────────────────────
  'CRSP','NTLA','EDIT','BEAM','SGMO','BLUE','RCKT','QURE','SOLID','SLDB',
  'VERV','VRNA','GRPH','OMIC','KDNY','IMCR','ALNY','ARWR','IONS','PTCT',
  'SRPT','BMRN','RARE','FOLD','KRYS','DNLI',
  // ── Medical devices ──────────────────────────────────────────────
  'ABMD','ALGN','ANGO','ATRC','AVNS','AXDX','AXGN','AXNX','BFLY','BRKR',
  'CLPT','CNMD','CSII','CTSO','DXCM','ENOV','EXAS','GKOS','IART','IDXX',
  'ILMN','INMD','INSP','IRTC','ISRG','LMAT','LUNG','MASI','MDXG','MMSI',
  'NARI','NDRA','NNOX','NVST','OFIX','OMCL','OSUR','PODD','RGEN','STAA',
  'TNDM',
  // ── Health IT / digital health ───────────────────────────────────
  'ACCD','AMWL','DOCS','GDRX','HCAT','HIMS','HQY','ICLR','LIVN','MDRX',
  'MEDP','ONEM','OPCH','OPRX','PGNY','RCM','SYNH','TDOC','WELL',
  // ── Specialty pharma / generics ──────────────────────────────────
  'ALKS','AMRN','AMRS','AMRX','CPIX','CPRX','ENDP','HRMY','HROW','LGND',
  'LPCN','LQDA','LXRX','MNKD','PAHC','PRGO','PRTK','RDUS','SPPI','TARO',
  // ── Oncology ─────────────────────────────────────────────────────
  'BGNE','BOLD','BPMC','CLDX','CORT','CTLT','CTMX','DCPH','DVAX','DYAI',
  'ENOB','EPZM','ERAS','GERN','GTHX','GRTS','GRTX','HALO','IBRX','IDYA',
  'IMGN','IMMU','INCY','INSM','IOVA','KPTI','KRYS','KYMR','LBPH','LEGN',
  'LOGC','LPCN','LQDA','LYEL','MDGL','MERUS','MIRM','MORF','MREO','NBTX',
  'NTLA','NUVL','NVCR','NVRO','OMGA','OMER','OPTN','ORIC','PBYI','PCVX',
  'PRAX','PRLD','RCKT','RCUS','RGLS','RIGL','RKDA','RUBY','RVMD','SNDX',
  'SOLID','SRPT','SRRK','SURF','SVRA','TBPH','TCRR','TCRX','TGTX','TILS',
  'TLCR','TRMR','TSVT','TTOO','TUPH','TVTX','VCYT','VERA',
  // ── CNS / neuroscience ───────────────────────────────────────────
  'ACAD','ACER','ADMS','AKLI','AKYA','ALDX','ALKS','ALVR','AMPH','ANNX',
  'ANVS','APRE','ARDX','ARQT','ASRT','ATHA','ATXS','AUPH','AVXL','AXSM',
  'BFRI','BIOL','BTAI','CAPR','CDTX','CERE','CMPS','CNCE','COCP','CRTX',
  'CYCN','EVOK','FREQ','HARP','INFI','IONS','ITCI','JANX','KALA','KMPH',
  'KRYS','LBPH','LGND','LIQT','LMNL','LNTH','LODE','LOGC','LPCN','LYRA',
  'MACK','MBIO','MBRX','MCRB','MEIP','MIRM','MNKD','MNMD','MNOV','MORF',
  'NMRA','PRAX','PRLD','PSNL','PTGX','PULM','STTK','STOK','TXMD','ATHA',
  // ── Immunology / autoimmune ───────────────────────────────────────
  'AGIO','AHCO','ALLK','APLS','APVO','ARGX','ARVN','AUPH','AVDL','AVXL',
  'AXLA','BXRX','CCCC','CCXI','CGEN','CGEM','CKPT','CNCE','COCP','CRIN',
  'CYCN','CYTO','EVOK','HARP','ITOS','ITCI','KALA','LYRA','MBRX','MEIP',
  'OMGA','OPTN',
  // ── Gene therapy / cell therapy ──────────────────────────────────
  'ABEO','BLCM','BLUE','BPTH','BRTX','CAPR','CBMG','CNTX','CRBU','DNLI',
  'FATE','FHTX','GBIO','GOVX','GRPH','LEGN','LYEL','OMIC','PASG','SANA',
  'SLDB','TWST','VCNX','BLUE','RCKT','QURE',
  // ── Rare / orphan disease ─────────────────────────────────────────
  'ACAD','AGIO','AGTC','AKRO','ALEC','ALGS','ALNY','ALXO','ANAB','ANIP',
  'APDN','APLT','ARCT','ATAI','ATRA','AVEO','AVIR','AVRO','BCEL','BCYC',
  'BDTX','BHVN','BLCM','BLTE','BPMC','BRTX','CERE','CGON',
  // ── Infectious disease / vaccines ────────────────────────────────
  'ADMA','ADGI','AXSM','CODX','DVAX','DYAI','ENOB','GILD','GOVX','IBIO',
  'INO','MRNA','BNTX','NVAX','OCGN','REGN','SIGA','SRNE','VBIV','VRTX',
  'ABBV','AMGN','BIIB',
  // ── Diagnostics & genomics ───────────────────────────────────────
  'AXDX','AXGN','BFLY','BRKR','CDNA','CEMI','DXCM','EXAS','GKOS','HTGM',
  'IART','ICAD','IDXX','ILMN','INMD','INSP','ISRG','LMAT','LUNG','MASI',
  'MDXG','MMSI','NARI','NDRA','NNOX','NSTG','NVST','OFIX','OMCL','OSUR',
  'PACB','PODD','RGEN','SEER','STAA','TNDM',
  // ── Mental health / psychedelics ─────────────────────────────────
  'ATAI','CMPS','MNMD','MIND','STOK','STTK',
  // ── Cardio / metabolic / endocrine ───────────────────────────────
  'AKBA','AKRO','ARDX','ARQT','ARWR','ASND','ATHA','BHVN','CRVS','DCPH',
  'FOLD','GLMD','GMAB','HRTX','RARE',
  // ── Ophthalmology ────────────────────────────────────────────────
  'ADVM','AXNX','CRNX','GKOS','ISEE','LENZ','OCUL','OPTH','RCKT','RGNX',
  // ── Dermatology ──────────────────────────────────────────────────
  'ACRS','ACRX','DRMA','FBTX','ITCI','MELA',
  // ── Core legacy FDA-play small-caps ──────────────────────────────
  'ATOS','CTIC','JAGX','SAVA','VBIV','SEEL','BLRX','NRXP','MMAT','NERV',
  'PTGX','PULM','EDSA','ELOX','IDRA','IMVT','ITOS','IVAC','JNCE','KALA',
  'KRTX','LIQT','LMNL','LUNA','LYRA','MACK','MBIO','MBRX','MCRB','MDXG',
  'MEIP','OCRX','OCUP','ONVO','ORGO','ORMP','OVID','OYST','PHAT','PHIO',
  'PIRS','PLRX','PMVP','POLA','PRPH','PRQR','PRTA','PSNL','RUBY','RVNC',
  'RVPH','RXRX','SPPI','AGEN','ADTX','AKBA','ATNF','AYTU','AZRX','BCAB',
  'BNGO','BNTC','AMRN','ANIX','ANVS','APRE','ARDX','ASRT','ATXI','AUPH',
  'BFRI','BIOL','BTAI','BXRX','CARA','CASI','CCXI','CDTX','CGEM','CGEN',
  'CKPT','CLBS','CLSD','CLVS','CMPS','CNCE','COCP','CODX','CPHI','CRDF',
  'CRNX','CRTX','CRVS','CTXR','CYCN','CYTO','DFFN','GNPX','INFI','KMPH',
  'MYOV','NBSE','PRPO','QLGN','ZSAN','OGEN','BLPH','OBSV','CIDM','CYTH',
  'SIGA','VVPR','OCUL','PDSB','ALBT','CPIX','HCWB','CHRS','MTSL','WTER',
  'VNRX','UAVS','RILY','LXRX','ATOS','CTIC','PAYA','SRNE','JAGX','SAVA',
  'NCPL','AEYE',
  // ── Additional unique picks ───────────────────────────────────────
  'ACRV','ACET','ACGS','ACHV','ABSI','NSTG','GAIN','GALT',
  'AURA','ALDX','ALNA','AMAG','ANIK','ANNX','APGE','APLS','ASMB',
  'ASND','BPTH','BIVI','CAPR','CCCC','CDNA','CDMO','CERT','CLPT',
  'CNTX','CRBU','DCPH','DMAC','DRMA','EWTX','FBTX','FHTX','FNCH',
  'GBIO','GLMD','GMAB','GTHX','HGEN','HRTX','HTGM','IMTX','INAB',
  'ITRM','KROS','LEGN','LENZ','LHCG','MGNX','MNOV','NDRA','NMRA',
  'NOVN','NTRB','NRIX','NVTA','OPTH','ORIC','OWLT','PASG','PHVS',
  'PSNL','PYXS','QNRX','RCUS','RVMD','SNDX','SRRK','STOK','STTK',
  'TWST','ACOR','ACHV','ACER','ALRN','AVDL','AVIR','AVRO','ARGX',
  'ARVN','AXNX','RGNX','DOVA','CERT','ENOV','ALGN','IRTC','HQY',
  'ICLR','MEDP','SYNH','LIVN','LHCG','ACCD','AMWL','DOCS','GDRX',
  'PGNY','RCM','TDOC','WELL','ONEM','OPCH','OPRX',
  'BLRX','NRXP','MMAT','NERV','PTGX','PULM','EDSA','ELOX','IDRA','IMVT',
  'ITOS','IVAC','JNCE','KALA','KRTX','LIQT','LMNL','LUNA','LYRA','MACK',
  'MBIO','MBRX','MCRB','MDXG','MEIP','OCRX','OCUP','ONVO','ORGO','ORMP',
  'OVID','OYST','PHAT','PHIO','PIRS','PLRX','PMVP','POLA','PRAX','PRLD',
  'PROG','PRPH','PRQR','PRTA','PSNL','RUBY','RVNC','RVPH','RXRX','SPPI',
  'ADMA','AGEN','ADTX','AKBA','ATNF','AYTU','AZRX','BCAB','BNGO','BNTC',
  'AMRN','ANIX','ANVS','APRE','ARDX','ARQT','ASRT','ATHA','ATXI','AUPH',
  'AVXL','AXLA','BFRI','BIOL','BTAI','BXRX','CARA','CASI','CCXI','CDTX',
  'CGEM','CGEN','CKPT','CLBS','CLSD','CLVS','CMPS','CNCE','COCP','CODX',
  'CPHI','CRDF','CRNX','CRTX','CRVS','CTXR','CYCN','CYTO','DFFN','GNPX',
  'INFI','KMPH','MYOV','NBSE','PRPO','QLGN','ZSAN','OGEN','BLPH','OBSV',
  'CIDM','CYTH','SIGA','VVPR','OCUL','PDSB','ALBT','CPIX','HCWB','CHRS',
  // ── A-tickers: clinical-stage not previously listed ───────────────
  'AADI','ACER','ACHV','ACOR','ACRX','ACRS','ACST','ADCT','ADGI','ADMS',
  'ADMP','ADPT','ADVM','ADXN','AFMD','AGIO','AGRX','AKLI','AKRO','AKYA',
  'ALBO','ALEC','ALGS','ALIM','ALHC','ALLK','ALRN','ALVR','AMEH','AMPH',
  'ANIK','ANNX','ANTX','APGE','APLS','APTO','APVO','APYX','AQST','ARAV',
  'ARCT','ARWR','ASLN','ASMB','ASND','ATAI','ATRC','ATRS','ATXS','AVDL',
  'AVEO','AVIR','AVNS','AVRO','AXDX','AXGN','AXSM','AYLA','ACAD','AGTC',
  'AKRO','ALEC','ALGS','ALPN','ALXO','ANAB','ANIP','APDN','APLT','AQST',
  'ARBE','ATRA','AVRO','ABCL','ABIO','ABUS','ADAP','AHCO','AIMD',
  // ── B-tickers ────────────────────────────────────────────────────
  'BCAB','BCEL','BCYC','BCRX','BDTX','BGNE','BHVN','BLCM','BLDE','BLFS',
  'BLTE','BOLD','BPMC','BRTX','BYSI','BFLY','BRKR','BMRN','BEAM','BLUE',
  'BNTX','BPMC','BRTX','BTAI','BXRX','BHVN','BGNE','BCYC',
  // ── C-tickers ────────────────────────────────────────────────────
  'CBMG','CBPO','CDMO','CEMI','CGON','CTLT','CTMX','CYTX','CERE','CRIN',
  'CRSP','CSII','CNMD','CERT','CLDX','CORT',
  // ── D-tickers ────────────────────────────────────────────────────
  'DBVT','DCPH','DCTH','DMAC','DNLI','DOVA','DRMA','DVAX','DYAI','DXCM',
  // ── E-tickers ────────────────────────────────────────────────────
  'EDIT','ENOB','EPZM','ERAS','ESPR','ETNB','EVOK','EWTX','EXAS','EXEL',
  // ── F-tickers ────────────────────────────────────────────────────
  'FBIO','FENC','FGEN','FLGT','FOLD','FREQ','FULC','FATE',
  // ── G-tickers ────────────────────────────────────────────────────
  'GBIO','GERN','GKOS','GNMK','GOVX','GRPH','GRTS','GRTX',
  // ── H-tickers ────────────────────────────────────────────────────
  'HALO','HARP','HEPA','HOOK','HRMY','HROW','HCAT','HIMS',
  // ── I-tickers ────────────────────────────────────────────────────
  'IBRX','ICAD','IDYA','IMAB','IMGU','IMMP','IMMU','IMNM','IMRX','IMTX',
  'INCY','INMD','INOG','INSP','INSM','IONS','IOVA','IPIX','IPSC','ISEE',
  'ISRG','ITCI',
  // ── J-L tickers ──────────────────────────────────────────────────
  'JANX','JAZZ','JNCE','KALA','KDNY','KMPH','KNSA','KRYS','KRTX','KYMR',
  'KPTI','LASR','LBPH','LGND','LIFE','LIQT','LMNL','LNTH','LODE','LOGC',
  'LPCN','LQDA','LUNA','LUMO','LYEL','LYRA',
  // ── M-tickers ────────────────────────────────────────────────────
  'MACK','MBIO','MBRX','MCRB','MDGL','MDXG','MEIP','MELA','MESO','MERUS',
  'MGTA','MGTX','MIRM','MNKD','MNMD','MORF','MREO','MRNA','MRSN','MRUS',
  'MASI',
  // ── N-O tickers ──────────────────────────────────────────────────
  'NBTX','NERV','NKTR','NNOX','NRXP','NSTG','NTLA','NUVL','NVCR','NVRO',
  'NWBO','NXTC','NPCE','NARI','NUVN','OCRX','OCUP','OCGN','OCUL','ONVO',
  'ORGO','ORMP','OTIC','OVID','OYST','OFIX','OPTN','OMCL',
  // ── P-Q tickers ──────────────────────────────────────────────────
  'PACB','PAVM','PBYI','PCVX','PDCO','PDYN','PHAT','PHIO','PIRS','PLRX',
  'PMVP','POLA','PODD','PRAX','PRGO','PRLD','PROG','PRPH','PRPO','PRQR',
  'PRTA','PSNL','PTCT','PTGX','PULM','PRTK','PDSB','QURE','QLGN',
  // ── R-tickers ────────────────────────────────────────────────────
  'RBGV','RCKT','RDUS','RGEN','RGLS','RIGL','RKDA','RLMD','RLYB','RMED',
  'RMMB','RPHM','RPID','RUBY','RVNC','RVPH','RXRX','RLAY','RARE',
  // ── S-tickers ────────────────────────────────────────────────────
  'SANA','SEER','SELB','SGMO','SIGA','SLDB','SOLID','SPPI','SRPT','STRO',
  'STSA','SURF','SVRA','SYBX','SRRK',
  // ── T-tickers ────────────────────────────────────────────────────
  'TALO','TARA','TARS','TBPH','TCRR','TCRX','TELA','TGTX','THMO','TILS',
  'TLCR','TNDM','TNXP','TRMR','TRVN','TSHA','TSIN','TSVT','TTOO','TTPH',
  'TUPH','TVTX','TXMD','TYRA','TARO',
  // ── U-Z tickers ──────────────────────────────────────────────────
  'UMRX','UROS','UTHR','VCNX','VCYT','VERA','VERV','VNDA','VRNA','VNRX',
  'VBIV','XBIO','XNCR','XOMA','XTNT','XXII','YMAB','YTRA','ZNTL','ZSAN',
  'ZYBT','XXII','XOMA','XNCR',
  // ── Genomics / CRISPR / RNA therapies ────────────────────────────
  'CRSP','NTLA','EDIT','BEAM','SGMO','BLUE','RCKT','QURE','SOLID','SLDB',
  'VERV','VRNA','GRPH','OMIC','KDNY','IMCR','ALNY','ARWR','IONS','PTCT',
  'SRPT','BMRN','RARE','FOLD','KRYS','DNLI','IMVT',
  // ── Medical devices ──────────────────────────────────────────────
  'ABMD','APYX','ATRC','AVNS','AXDX','AXGN','BFLY','BRKR','CNMD','CSII',
  'CTSO','DXCM','EXAS','GKOS','IART','ILMN','INMD','INSP','ISRG','LMAT',
  'LUNG','MASI','MDXG','MMSI','NARI','NNOX','NVST','OFIX','OMCL','OSUR',
  'PODD','RGEN','STAA','TNDM','ENOV','ALGN','IRTC','NVCN','NVNS','IEHC',
  'ANGO','HAYN','HEPA','IMOS','INFU','INVA','NUVA','NPCE','NRIX',
  // ── Health tech / digital health ─────────────────────────────────
  'ACCD','AMWL','DOCS','GDRX','HCAT','HQY','MDRX','ONEM','OPCH','OPRX',
  'PGNY','RCM','TDOC','WELL','LIVN','OMCL','HIMS','IRTC','ALGN',
  // ── Specialty pharma ─────────────────────────────────────────────
  'AMRN','AMRS','AMRX','ALKS','ENDP','PRTK','LNTH','LXRX','CPRX','HRMY',
  'LGND','LPCN','LQDA','PAHC','PRGO','RDUS','SPPI','MNKD','TARO','HZNP',
  'INCY','EXEL','SGMO','AKBA','CPIX',
  // ── Oncology: targeted / immuno ──────────────────────────────────
  'KPTI','KRYS','KYMR','LBPH','IOVA','IMGN','IMMU','GERN','GRTS','CRTX',
  'CRVS','CTMX','EPZM','ERAS','BGNE','BOLD','CLDX','CORT','CTLT','DVAX',
  'HALO','IBRX','IDYA','INCY','INSM','RCKT','FATE','BCRX',
  // ── Neuroscience / CNS ───────────────────────────────────────────
  'ACAD','ACER','ADMS','ALKS','ALVR','AMPH','ANVS','AXSM','CMPS','MNMD',
  'ATAI','BFRI','CDTX','CERE','CNCE','COCP','CRTX','CYCN','EVOK','ITCI',
  'KALA','LIQT','LMNL','MIRM','MORF','ATHA','HARP',
  // ── Immunology / autoimmune ───────────────────────────────────────
  'ALLK','AUPH','BXRX','CCXI','CGEN','CGEM','CKPT','CNCE','COCP','CRIN',
  'CYCN','EVOK','ITOS','JANX','LYRA','MBIO','MBRX','MCRB','OMGA','OPTN',
  // ── Infectious disease / vaccines ────────────────────────────────
  'GOVX','DVAX','MRNA','BNTX','IBIO','ADMA','REGN','VRTX','GILD','ABBV',
  'AMGN','BIIB','AXSM','CODX',
  // ── Rare / orphan disease ─────────────────────────────────────────
  'ACAD','AGIO','AGTC','AKRO','ALEC','ALGS','ANAB','ANIP','APDN','APLT',
  'ARCT','ATAI','ATRA','AVEO','AVIR','AVRO','BCEL','BCYC','BDTX','BHVN',
  'BLCM','BLTE','BPMC','BRTX','CERE','CGON','OMER','OMGA',
  // ── Cardio / metabolic ───────────────────────────────────────────
  'AKBA','AKRO','ARDX','ARQT','ARWR','BHVN','CRVS','AMRN','FOLD','ALNY',
  // ── Ophthalmology / dermatology ──────────────────────────────────
  'OCUL','ISEE','IVAC','GKOS','NPCE','OPTX','AXDX','AXGN','OSUR','ANGO',
  'CNMD','CSII','CTSO','EXAS','IART','ILMN','INSP','LMAT','MASI','MELA',
  // ── Mental health / psychedelics ─────────────────────────────────
  'CMPS','MNMD','ATAI','MIND','ANVS','BIOL','BTAI','CDTX','FREQ','HARP',
  // ── Diagnostics & lab services ───────────────────────────────────
  'EXAS','ILMN','PACB','NNOX','NSTG','AXDX','SEER','TNDM','DXCM','PODD',
  'ABMD','IART','CEMI','GKOS','NVST','OSUR','MDXG','RGEN','STAA',
  // ── Mid-large cap biotech with catalyst volatility ────────────────
  'REGN','VRTX','GILD','ABBV','BIIB','AMGN','ALXN','BMRN','SGEN','ALNY',
  'IONS','RARE','PTCT','SRPT','FOLD','KRYS','IMCR',
  // ── Additional unique micro-cap picks ────────────────────────────
  'AADI','ABEO','ACET','ACMR','ACHV','ACOR','ACRV','ACST','ADCT','ADGI',
  'ADMS','ADMP','ADPT','ADTX','ADVM','ADXN','AFMD','AGIO','AGRX','AHCO',
  'AIMD','AKBA','AKLI','AKRO','AKYA','ALBO','ALEC','ALGS','ALIM','ALHC',
  'ALLK','ALRN','ALVR','AMEH','AMPH','ANIK','ANNX','ANTX','APGE','APLS',
  'APTO','APVO','APYX','AQST','ARAV','ARCT','ARDX','ARWR','ASLN','ASMB',
  'ASND','ATAI','ATHA','ATNF','ATRC','ATRS','ATXS','AVDL','AVEO','AVIR',
  'AVNS','AVRO','AVXL','AXDX','AXGN','AXSM','AYLA','AYRG','NEPT',
  'BCAB','BCEL','BCYC','BCRX','BDTX','BFRI','BGNE','BHVN','BLCM','BLDE',
  'BLFS','BLTE','BLUE','BNGO','BNTC','BNTX','BOLD','BPMC','BRTX','BYSI',
  'CBMG','CBPO','CDMO','CEMI','CGEM','CGON','CKPT','CLBS','CLSD','CLVS',
  'CMPS','CNCE','CNMD','COCP','CODX','CPHI','CRDF','CRNX','CRTX','CRVS',
  'CRSP','CTLT','CTMX','CTXR','CYCN','CYTO','DBVT','DCPH','DCTH','DFFN',
  'DMAC','DNLI','DOVA','DRMA','DVAX','DYAI','DXCM','EDIT','EDSA','ELOX',
  'ENOB','ENOV','EPZM','ERAS','ESPR','ETNB','EVOK','EWTX','EXAS','EXEL',
  'FBIO','FENC','FGEN','FLGT','FOLD','FREQ','FULC','FATE',
  'GBIO','GERN','GKOS','GNMK','GOVX','GRPH','GRTS','GRTX',
  'HALO','HARP','HEPA','HOOK','HRMY','HROW','IBRX','ICAD','IDYA','IMAB',
  'IMGU','IMMP','IMMU','IMNM','IMRX','IMTX','IMVT','INCY','INFI','INMD',
  'INOG','INSP','INSM','IONS','IOVA','IPIX','IPSC','ISEE','ITCI',
  'JANX','JAZZ','JNCE','KALA','KDNY','KMPH','KNSA','KRYS','KRTX','KYMR',
  'KPTI','LASR','LBPH','LGND','LIFE','LIQT','LMNL','LNTH','LODE','LOGC',
  'LPCN','LQDA','LUNA','LUMO','LYEL','LYRA',
  'MACK','MBIO','MBRX','MCRB','MDGL','MDXG','MEIP','MELA','MESO','MERUS',
  'MGTA','MGTX','MIRM','MNKD','MNMD','MORF','MREO','MRNA','MRSN','MRUS',
  'NBTX','NKTR','NNOX','NRXP','NSTG','NTLA','NUVL','NVCR','NVRO','NWBO',
  'NXTC','NPCE','NARI','NUVN','OCRX','OCUP','OCGN','OCUL','ONVO','ORGO',
  'ORMP','OTIC','OVID','OYST','OFIX','OPTN','OMCL','OMER','OMGA',
  'PACB','PAVM','PBYI','PCVX','PDCO','PDYN','PHAT','PHIO','PIRS','PLRX',
  'PMVP','POLA','PODD','PRAX','PRGO','PRLD','PROG','PRPH','PRQR','PRTA',
  'PSNL','PTCT','PTGX','PULM','PRTK','QURE','QLGN',
  'RBGV','RCKT','RDUS','RGEN','RGLS','RIGL','RKDA','RLMD','RLYB','RMED',
  'RMMB','RPHM','RPID','RUBY','RVNC','RVPH','RXRX','RLAY','RARE',
  'SANA','SEER','SELB','SGMO','SIGA','SLDB','SOLID','SRPT','STRO','STSA',
  'SURF','SVRA','SYBX','TALO','TARA','TARS','TBPH','TCRR','TCRX','TELA',
  'TGTX','THMO','TILS','TLCR','TNDM','TNXP','TRMR','TRVN','TSHA','TSIN',
  'TSVT','TTOO','TTPH','TUPH','TVTX','TXMD','TYRA','UMRX','UROS','UTHR',
  'VCNX','VCYT','VERA','VERV','VNDA','VRNA','VBIV','XBIO','XNCR','XOMA',
  'XTNT','XXII','YMAB','YTRA','ZNTL','ZSAN','ZYBT',
  // ── More small pharma picks ───────────────────────────────────────
  'ACRX','ACRS','ADMP','ADXN','AGRX','AKLI','AKYA','ALDX','ALVR','AMEH',
  'ANTE','ANTH','ASLN','AIMD','ALBO','ALBY','ALRS','AMBC','AYLA',
  'ABCL','ABIO','ABUS','ADAP','ADCT','ADGI','ADPT','WTER','VNRX','UAVS',
  'RILY','OCUL','LXRX','ATOS','CTIC','PAYA','SRNE','JAGX','SAVA',
  'HCWB','CHRS','MTSL','VVPR','SIGA','BLPH','OBSV','CIDM','CYTH',
  'CPIX','NCPL','ALBT','AEYE','SEEL','PDSB',
  // ── CRO / lab / health services ───────────────────────────────────
  'ICLR','MEDP','SYNH','PGNY','HCAT','DOCS','ACCD','AMWL','GDRX','RCM',
  'TDOC','HQY','MDRX','ONEM','OPCH','OPRX','WELL','LIVN','HIMS',
  // ── More unique names to round out 1500 ──────────────────────────
  'ACET','ACGS','ACHV','ACLX','ACRV','ACST','ACER','ADMA','ADMP','AGEN',
  'AGRX','AHPI','AIMD','AKBA','AKLI','ALBO','ALRN','AMPH','ANIK','ANNX',
  'APGE','APLS','APTO','APVO','AQST','ARAV','ASMB','ASND','AVDL','AVEO',
  'AVIR','AVNS','BFLY','BRKR','BYSI','CBMG','CBPO','CDMO','CERT','CGON',
  'CLDX','CORT','CTMX','CYTX','DBVT','DCPH','DCTH','DMAC','DNLI','DRMA',
  'ESPR','ETNB','EWTX','FBIO','FGEN','FLGT','FULC','GBIO','GOVX','GRPH',
  'HOOK','HRMY','IMNM','IMRX','IMTX','IPSC','KNSA','LUMO','MERUS','MIRM',
  'MNMD','MRSN','NUVL','NVCR','NVRO','NWBO','NXTC','RBGV','RDUS','RGLS',
  'RIGL','RKDA','RLMD','RLYB','RMED','RMMB','RPHM','RPID','SANA','SELB',
  'SLDB','SOLID','STRO','STSA','SURF','SVRA','SYBX','TALO','TARA','TARS'
  ])],
  ENERGY: [...new Set([
  // Oil & Gas E&P small caps
  'ESTE','CPER','BATL','REPX','TPVG','MNRL','VIST','VTLE','CRGY','CIVI',
  'CHRD','SandP','ROCC','RING','KALU','PARR','DINO','MTDR','CTRA','CRC',
  'NOG','SM','SPTN','PTEN','WTTR','NGL','CUI','AMPY','SNDE','HLCO',
  'ENSV','TUSK','PED','KLXE','BORR','NINE','NRUC','CCLP','SRLP','USAC',
  'FLNG','MMLP','CAPL','CDEV','SGBX','TELL','GXII','PFIE','IMAQ','STRP',
  // Oil & Gas micro caps / volatile
  'INDO','IOGP','NEXT','ARIS','DUNE','GRNT','MCLD','WTTR','RNGR','OIS',
  'NGAS','MNRL','PHX','GPP','MMLP','SBOW','CPK','CALY','TALO','SilJ',
  'SDCL','SNPX','PRTG','FANG','CDEV','REI','SWN','RRC','CNX','AR',
  'GPOR','KOS','SD','DNR','WTI','BRY','MGY','VAALCO','IMPP','HUSA',
  'ZOIL','GUSAF','OILCF','CAOIF','TEYLU','PTSX','RSSS','TPAN','PNRG','PEII',
  // Natural gas
  'EQT','CNX','RRC','SWN','AR','GPOR','COG','CTRA','FANG','DVN',
  'PDCE','SM','BATL','CRGY','KOS','OVV','CVE','ARCH','SilJ','XOM',
  // Oil field services
  'SLB','HAL','BKR','WTTR','NINE','KLXE','PTEN','OIS','NBR','RES',
  'CCLP','NRUC','SRLP','USAC','PFIE','RNGR','BOOM','OII','TUSK','BORR',
  'PLOW','FI','NEWP','ESNT','FLMN','NEX','KFRC','DNOW','MRC','DRIL',
  // Pipelines / midstream
  'AM','TRGP','WES','DCP','MPLX','ENB','TRP','KMI','OKE','WMB',
  'PAA','PAGP','SRLP','CAPL','GEL','USAC','NGL','MMLP','CCLP','GPP',
  'FLNG','GMLP','KNOP','GLOP','TGS','ETRN','HESM','CDEV','LNG','NFG',
  // Uranium
  'UEC','UUUU','DNN','CCJ','NXE','UROY','BQSSF','URG','FCUUF','ENCUF',
  'LTBR','GLO','BKUCF','WSTRF','CURUF','DYLLF','PALAF','URNM','URA','SRUUF',
  'YLDF','AZUUF','NXEF','GVXXF','PDN','BMN','BOE','ERA','PEN','VAL',
  // Lithium
  'LAC','SQM','ALB','PLL','LTHM','SGML','LITM','GFAI','AMLI','LLKKF',
  'CLIS','ATLX','ACDC','POWW','IPWR','FREYR','LILM','MVST','THMO','FLUX',
  'IONR','SLNX','LTUM','AMPE','CBAT','CBNTF','HLTH','EVGO','CHPT','BLNK',
  // Copper & base metals
  'COPX','FCX','SCCO','HBM','CS','TGB','TECK','FM','LUN','IVN',
  'NGEX','SOLG','KDNC','NGXB','CPPM','AURC','MTAL','ERO','CMMC','ANTO',
  'CPMC','HUSI','LTCN','CPER','GATO','AG','CDE','PAAS','MAG','EXK',
  // Gold miners
  'NEM','GOLD','AEM','AGI','KGC','EGO','AU','IAG','HMY','GFI',
  'DRD','SAND','RGLD','WPM','FNV','OR','MAG','MUX','SSRM','HL',
  'ARIS','AUMN','BSVI','HYMC','USAS','GORO','GSS','MXC','IAUX','OROCF',
  'VZLA','KORE','MAKO','ELRN','FILO','BCSA','SGLD','BGLD','MMNGF','ETMGF',
  'NGD','BTG','SVLK','LGCL','GLDX','GLDG','EQTY','LGDTF','ROXG','EVGBC',
  'TORR','ELEF','GOLD','SILV','SGSVF','ABRN','LODE','GMIN','MGLD','GFAI',
  // Silver miners
  'AG','PAAS','CDE','HL','EXK','MAG','SILV','SSRM','MXC','USAS',
  'AUMN','GORO','IAUX','SVLK','BCSA','HYMC','SVBL','MKGAF','LODE','MFG',
  // Gold & silver royalties
  'WPM','FNV','RGLD','OR','SAND','EMX','MMX','MTAL','GROY','NRGOF',
  // Platinum group metals / palladium
  'PLZL','PALAF','SID','SBSW','IMP','SGBX','NORTF','CLNV','PTLKF','PALL',
  // Rare earths & critical minerals
  'MP','UUUU','REE','NVMI','LYSCF','NTRUF','NOVAF','HREE','GRAS','MLXEF',
  'AMNE','RCIHH','AREFB','LIROF','PRSEF','ETRM','SGML','MLYF','CHMN','USRMF',
  // Coal
  'ARCH','CEIX','AMR','HCC','BTU','HNRG','METC','RAMR','NCPL','HLAK',
  'FELP','NCOIF','CCOIF','SYNAF','ADYYF','BCICF','SLCXF','PCXCQ','FXNC','CNXC',
  // Iron ore / steel
  'CLF','X','MT','TX','NUE','STLD','RS','CMC','SID','VALE',
  'GGAL','USAP','ZEUS','KALU','ATI','ALB','WOR','CENX','HAYN','MSTL',
  // Aluminum
  'CENX','AA','KALU','ARNC','ALCOA','NHYDY','IALUF','ALUM','ALUMF','MTAL',
  // Solar energy
  'ENPH','SEDG','FSLR','RUN','NOVA','SHLS','ARRY','CSIQ','JKS','SPWR',
  'MAXN','HAPO','POLA','AMPS','AZRE','GPRE','FTCI','GXII','CSLR','SLTB',
  'PEGY','ATNI','GIGA','CLNR','SLCE','STKH','SMRT','SOL','DAQO','GCL',
  'JASO','YGE','TSL','HSOL','CSUN','SFUN','LDK','TPVG','PDYN','HLCO',
  // Wind energy
  'VWSYF','ORSTED','ENLT','AMRC','AY','CWEN','NEXE','GNPX','NEE','BEP',
  'SGRE','WPRT','ZGENF','RWEOY','EDPR','INFN','LTBR','MMEX','GPRE','TPVG',
  // EV & battery technology
  'TSLA','RIVN','LCID','GOEV','WKHS','SOLO','AYRO','KNDI','IDEX','NKLA',
  'FFIE','MULN','EVTV','ZEV','ELMS','THMO','MVST','CBAT','CBNTF','BNET',
  'ACDC','FLUX','AMPE','IPWR','FREYR','BTBT','CHPT','EVGO','BLNK','SNPR',
  'CLNV','HYZN','LOTZ','LFLY','RIDE','WATT','GFAI','ZAPP','AYRO','SOLO',
  'ACTC','CENN','ELVA','EVFI','ARVL','PTRA','DKNG','GGPI','XPEV','LI',
  'NIO','BYDDY','GELYF','SLDP','RNXT','CSLR','CLSK','SRM','BKSY','SPCE',
  // Hydrogen & fuel cells
  'PLUG','FCEL','BLDP','BE','HTOO','HYZN','HYZON','HGEN','HTAQ','HPNN',
  'NFGC','LIQT','PURA','HDRO','CLNE','HYZON','FGMC','NDRA','HTPA','GFLO',
  'HGEN','MFAC','AMTX','FLGT','GEVO','AMTX','PEGY','GPRE','REX','AMRC',
  // Clean energy / renewable
  'CLNE','AMRC','AY','CWEN','BEP','HASI','NOVA','RUN','SHLS','ARRY',
  'NEE','ENPH','SEDG','FSLR','CSLR','SLTB','AZRE','GPRE','FTCI','GIGA',
  'PEGY','SLCE','STKH','SMRT','SOL','ZGENF','RWEOY','EDPR','SGRE','ENLT',
  'ATNI','CLNR','LTBR','MMEX','NCPL','WPRT','INFN','LFLY','SNPR','ACTC',
  // Natural resources / commodity ETPs
  'USO','UNG','GLD','SLV','COPX','GDX','GDXJ','XOP','XLE','FCG',
  'REMX','LIT','URA','URNM','PALL','PPLT','DBO','DBB','DBA','DJP',
  // Potash & fertilizers
  'MOS','NTR','CF','UAN','WLKP','ICL','K','YARA','MBII','GPRE',
  'RENEW','REX','AMTX','GEVO','PCRX','GPRE','CLNE','AMRC','AVTA','KBSF',
  // Mining equipment & services
  'BOOM','ASTE','KMT','TRS','GENC','RXN','MLAB','MRC','DNOW','CACTUS',
  'WTTR','NINE','OIS','PFIE','NEX','KLXE','PTEN','RNGR','NBR','RES',
  // Specialty chemicals / materials
  'LYB','HUN','CC','OLN','WLK','TROX','KWR','MEOH','IOSP','FUL',
  'CRAY','ASIX','GVHP','HYMC','SENEA','KBSF','GGAL','LIQT','PURA',
  // Water / environmental
  'CWCO','PCRX','AWR','YORW','MSEX','SJW','ARTW','WTRG','GWRS','FATHM',
  'CLWT','PESI','HPNN','AMWL','ARIS','DUNE','GRNT','NGAS','CALY','TALO',
  // Geothermal / other
  'GPRE','ORMAT','ENLT','AY','CWEN','AMRC','BEP','HASI','NEE','CLNE',
  // More oil & gas small caps
  'HUSA','IMPP','REI','SD','WTI','BRY','VAALCO','ZOIL','DUNE','AMPY',
  'SNDE','HLCO','ENSV','TUSK','PED','CDEV','NGAS','PHX','SBOW','CPK',
  'CALY','PRTG','FANG','MCLD','OIS','GRNT','IOGP','NEXT','CCLP','USAC',
  // Coal & met coal
  'ARCH','CEIX','AMR','HCC','BTU','HNRG','METC','RAMR','NCPL','HLAK',
  // More uranium
  'UEC','UUUU','DNN','CCJ','NXE','UROY','URG','LTBR','GLO','BKUCF',
  // More lithium / battery materials
  'LAC','SQM','ALB','PLL','LTHM','SGML','LITM','AMLI','CLIS','ATLX',
  // More gold
  'NEM','GOLD','AEM','AGI','KGC','EGO','AU','IAG','HMY','GFI',
  'DRD','SAND','RGLD','WPM','FNV','OR','MAG','MUX','SSRM','HL',
  'NGD','BTG','AUMN','HYMC','USAS','GORO','GSS','MXC','IAUX','LODE',
  // More silver
  'AG','PAAS','CDE','EXK','SILV','SVLK','BCSA','SVBL','GORO','MXC',
  // More copper
  'FCX','SCCO','HBM','TGB','TECK','ERO','CMMC','GATO','MTAL','CPPM',
  // More clean energy / EV
  'HYZN','CLSK','BTBT','GFAI','ZAPP','SNPR','CENN','ELVA','EVFI','ARVL',
  'PTRA','DKNG','GGPI','XPEV','LI','NIO','BYDDY','SLDP','CLNV','LFLY',
  // Offshore drilling
  'BORR','VAL','DO','NE','RIG','SDRL','PACD','ATW','ORIG','HES',
  // LNG / shipping
  'FLNG','GLOP','GMLP','KNOP','TGS','ETRN','HESM','LNG','NFG','CQP',
  'COOL','CELP','GLP','SPH','SU','CNQ','CVE','OVV','BTE','PEY',
  // Canadian oil sands / royalties
  'SU','CNQ','CVE','OVV','BTE','PEY','ERF','CPG','BTEG','PROP',
  // More E&P
  'ESTE','REPX','ROCC','RING','PARR','DINO','MTDR','CTRA','CRC','NOG',
  'SM','PTEN','KLXE','BORR','NINE','NGL','CUI','AMPY','SNDE','HLCO',
  // Additional unique picks
  'VGAS','LFST','NRXP','ENSR','CGBD','HNNA','GFAI','POAI','AMMO','CCEL',
  'INDO','RCMT','PFIE','SRCI','CLNE','AMRC','GPRE','REX','AMTX','GEVO',
  'PEGY','ATNI','GIGA','CLNR','SLCE','STKH','SMRT','HLCO','TUSK','PED',
  'ENSV','RNGR','OIS','NRUC','NINE','NEX','KFRC','DNOW','MRC','DRIL',
  'BOOM','FI','NEWP','ESNT','FLMN','WTTR','PLOW','KLXE','NBR','RES',
  // Oil tankers / product tankers (commodity-correlated shipping)
  'STNG','INSW','TRMD','DHT','EURN','FRO','NAT','TNP','TK','TOPS',
  'DLNG','NVGS','CPLP','CLCO','SMLP','NRP','SITIO','APA','VNOM','BSM',
  // Dry bulk shipping (moves with coal, iron ore, grain)
  'GOGL','SBLK','GNK','NMM','CMRE','PANL','EGLE','GRIN','SHIP','SALT',
  'NETI','CHNR','EDRY','GLBS','PSHG','TPIC','DSGX','BWXT','TRTN','ATEX',
  // Battery storage / grid-scale energy
  'STEM','NRGV','BEAM','FLUX','FREYR','MVST','CBAT','SLDP','HAPO','DCFC',
  'WKHS','SOLO','AYRO','ZAPP','ACHR','JOBY','EVTV','ARVL','PTRA','CENN',
  // More gold / silver miners
  'SVM','GPL','TRX','PLG','AUMB','AMS','SIL','GLDM','IAU','SIVR',
  'BCEKF','RUGPF','MFMSF','LGDTF','PRYMF','LBRTF','MXSGF','NFGFF','BPYFF','GSRCF',
  // More uranium miners
  'UUUU','UEC','DNN','NXE','UROY','URG','LTBR','BQSSF','FCUUF','ENCUF',
  'CURUF','PALAF','SRUUF','DYLLF','YLDF','AZUUF','NXEF','GVXXF','WSTRF','PRSEF',
  // Rare earth / critical minerals
  'MP','REE','NVMI','LYSCF','NTRUF','HREE','GRAS','MLXEF','USRMF','AMNE',
  'RCIHH','AREFB','LIROF','ETRM','SGML','MLYF','CHMN','UURAF','TMMFF','NIOAF',
  // More lithium / EV materials
  'LAC','PLL','LTHM','SGML','LITM','AMLI','CLIS','ATLX','ACDC','POWW',
  'IONR','SLNX','LTUM','CBNTF','HLTH','MVNR','TMRR','MGXXF','SBEV','AMTX',
  // More solar micro-caps
  'JASO','YGE','TSL','HSOL','CSUN','LDK','SOL','PDYN','SLCE','STKH',
  'SMRT','CSLR','SLTB','AZRE','FTCI','GIGA','MAXN','DAQO','HAPO','POLA',
  // More clean energy / biofuels
  'GEVO','AMTX','GPRE','REX','CLNE','AMRC','AY','CWEN','HASI','BEP',
  'ENLT','WPRT','MMEX','NCPL','INFN','LFLY','SNPR','ACTC','PEGY','ATNI',
  // More E&P small caps
  'INDO','IOGP','HUSA','IMPP','REI','SD','WTI','BRY','VAALCO','ZOIL',
  'DUNE','AMPY','SNDE','ENSV','TUSK','PED','CDEV','NGAS','PHX','SBOW',
  'CPK','CALY','GRNT','CCLP','USAC','MCLD','OIS','PRTG','NEXT','ARIS',
  // More oilfield services / equipment
  'WTTR','NINE','KLXE','PTEN','OIS','NBR','RES','CCLP','NRUC','SRLP',
  'PFIE','RNGR','BOOM','OII','TUSK','BORR','PLOW','NEX','DNOW','MRC',
  // Offshore drilling rigs
  'VAL','DO','NE','RIG','SDRL','PACD','ATW','ORIG','NOVN','VAALCO',
  // More coal / metals
  'ARCH','CEIX','AMR','HCC','BTU','HNRG','METC','NCPL','HLAK','FELP',
  'CLF','X','MT','TX','NUE','STLD','RS','CMC','SID','VALE',
  'CENX','AA','KALU','ARNC','HAYN','USAP','ZEUS','WOR','ATI','ALB',
  // Potash / fertilizer / ag commodities
  'MOS','NTR','CF','UAN','WLKP','ICL','MBII','RENEW','KBSF','AVTA',
  // Environmental / water / specialty
  'CWCO','AWR','YORW','MSEX','SJW','ARTW','WTRG','GWRS','CLWT','PESI',
  // Nickel / cobalt / specialty metals
  'HNNMY','MKORF','SBSW','SWC','PLG','VEDL','ANTO','IVN','LUN','FM',
  // More midstream / pipeline MLPs
  'CEQP','SMLP','AM','TRGP','WES','DCP','MPLX','ENB','TRP','KMI',
  'OKE','WMB','PAA','PAGP','GEL','HESM','LNG','NFG','CQP','SPH',
  // Canada oil/gas cross-listed
  'SU','CNQ','CVE','OVV','BTE','PEY','ERF','CPG','BTEG','PROP',
  // Additional unique energy small caps
  'MNRL','VIST','VTLE','CRGY','ESTE','REPX','BATL','ROCC','NOG','SM',
  'MTDR','CTRA','CRC','PARR','DINO','SWN','RRC','CNX','AR','GPOR',
  'KOS','MGY','IMPP','HUSA','AMPY','TALO','CDEV','REI','SD','DNR',
  // International oil majors (ADRs — volatile on geopolitics)
  'EQNR','YPF','EC','PBR','TTE','BP','E','RDSB','STO','CVX',
  'CNE','PGH','GTE','VAALCO','TGA','GPRK','LBOW','PLTK','GECC','SDCL',
  // Petroleum refiners / downstream
  'MPC','PSX','VLO','DK','PBF','CVI','CLMT','CAPL','HFC','CVRR',
  'TROX','MEOH','LYB','HUN','OLN','WLK','CC','KWR','IOSP','FUL',
  // Nuclear energy & small modular reactors
  'LEU','OKLO','SMR','GEV','VST','CEG','AMSC','NLR','URA','URNM',
  'BWX','LTBR','NNE','NANO','BWXT','NRGU','ATOME','STRNF','BNNXF','DYLLF',
  // Grid-scale storage & power tech
  'STEM','NRGV','BEAM','DCFC','WPRT','WATT','XPOF','ENER','ACNB','FLUX',
  // Polestar / more EV
  'PSNY','BLBD','WKHS','SOLO','AYRO','KNDI','IDEX','NKLA','MULN','FFIE',
  // More precious metals miners
  'AXU','ASM','SA','GAU','SVM','GPL','TRX','PLG','AUMB','CORR',
  'NOVG','MCLD','CEE','MNTN','PMET','SKYGF','SEIFF','GDRZF','MLNXF','BGGRF',
  // More copper / base metals juniors
  'SOLG','KDNC','NGXB','CPPM','AURC','NGEX','ERO','CMMC','GATO','TGB',
  // More natural gas / LNG
  'TELL','NEXT','NFGC','CLCO','DLNG','NVGS','CPLP','GLOP','GMLP','KNOP',
  // More clean energy juniors
  'AMRC','HASI','CWEN','AY','NEE','BEP','ENLT','GPRE','REX','GEVO',
  // Carbon capture / emerging energy
  'CCRB','XCCC','OCEL','CLNR','MMEX','NCPL','LTBR','PURA','LIQT','HDRO',
  // Shipping (commodity-correlated dry bulk)
  'EGLE','GOGL','SBLK','GNK','NMM','CMRE','PANL','GRIN','SHIP','SALT',
  'NETI','EDRY','GLBS','PSHG','TOPS','TNP','NAT','FRO','EURN','DHT',
  'INSW','TRMD','STNG','TK','DLNG','ASC','SEANM','BSRT','GASS','CPLP',
  // More oilfield services
  'OII','TUSK','BORR','VAL','DO','NE','RIG','SDRL','PACD','ORIG',
  // Specialty materials / industrial metals
  'VEDL','SBSW','PLG','HAYN','USAP','ZEUS','ATI','ALB','ARNC','KALU',
  'CENX','AA','MSTL','GGAL','ASIX','GVHP','SENEA','CRAY','FUL',
  // Agricultural commodities / biofuels
  'REX','GPRE','AMTX','GEVO','CLNE','AMRC','MOS','NTR','CF','UAN',
  'WLKP','ICL','K','MBII','RENEW','AVTA','KBSF','PCRX','HNNA','CCEL',
  ])],
  // LIST 4: TECH & RETAIL — small cap tech, software, semis, cybersecurity,
  //   AI-adjacent, e-commerce, consumer retail, apparel, restaurants,
  //   consumer brands, DTC. Volatile on earnings/product/sector momentum.
  TECH: [...new Set([
  // ── Semiconductors & Chip Equipment ────────────────────────────
  'ACMR','AEHR','ALGM','AMKR','AOSL','AXTI','CAMT','CEVA','COHU','CRUS',
  'DIOD','EMKR','ENVX','FORM','ICHR','IMOS','INDI','IPGP','KLIC','LASR',
  'LSCC','MKSI','MRAM','MTSI','MX','NOVT','OLED','ONTO','PDFS','PLAB',
  'POWI','QRVO','RMBS','SIMO','SITM','SLAB','SMTC','SWKS','SYNA','TSEM',
  'UCTT','VICR','ACLS','AMBA','ENTG','MPWR','NTGR','SMIT','ATMU','TTMI',
  'HIMX','PXLW','AEVA','VIAV','RELL','PCTI','GILT','LIQT','DAIO','INSG',
  'RBBN','ERIC','ERII','CIEN','SILC','SCSC','INPX','NTAP','DGII','CLFD',
  // ── Cybersecurity & Network Security ────────────────────────────
  'ATEN','AVST','BBAI','CISO','DFIN','EVRI','IRNT','JAMF','QLYS','RSKD',
  'TENB','TUFN','VRNS','ZI','NTCT','RDWR','OSPN','NLOK','CRWD','PANW',
  'FTNT','CHKP','ZS','FORC','BKSY','ARQQ','CODA','OTRK','VNET','HIIQ',
  'MODN','LPSN','EGHT','SMCI','BBAI','QLYS','TENB','TUFN','VRNS','ZI',
  'CYBR','S','MNDT','KNBE','SCWX','FEYE','CERT','RSKD','OSPN','NTCT',
  // ── AI / ML / Data Analytics ────────────────────────────────────
  'PLTR','SOUN','GFAI','GIGA','IMMR','MIND','NSTG','PRCT','QMCO','SEER',
  'UPWK','ZETA','BRZE','NCNO','DOMO','FRSH','GLBE','LSPD','MGNI','PUBM',
  'TBLA','APLD','AISP','DTIL','NTST','MNDY','GTLB','AIXI','AIWS','DCBO',
  'BTRS','STRM','VYX','CLNV','PATI','NRXP','CPAI','SPAI','SWVL','ARQQ',
  // ── Cloud Software / SaaS ───────────────────────────────────────
  'ACCD','AGYS','ALKT','ALRM','AMSC','APPF','APPN','AVNW','BAND','BIGC',
  'BLKB','CGNT','CLPS','CMTL','CPSI','CSWI','DUOS','DZSI','EXTR','FARO',
  'FIVN','FORR','FSLY','GDYN','GRND','HCAT','HOLI','ICLK','INFU','INFN',
  'INTT','IRIX','JNPR','KFRC','LLNW','LOGI','LYFT','MARK','MFGP','MIR',
  'MTLS','MTTR','NABL','NARI','NEGG','NVEI','NXST','OPRA','PAGS','PERI',
  'PRFT','RAMP','SMAR','SVMK','TISI','TLND','TRNS','TRVG','TTEC','TTGT',
  'TWST','TZOO','UDMY','UPLD','UPTS','VERI','AKAM','BILL','CFLT','CSGS',
  'DOCU','DXPE','EVBG','EXAS','EXEL','EXLS','EXPI','FFIV','FOUR','FTCI',
  'GDOT','GDRX','GH','GKOS','HTGC','HTLD','IDCC','IRMD','LRCX','MDB',
  'MLCO','MRVL','MSGE','MSRT','MTCH','NBIX','NWSA','PAYX','SNOW','SPLK',
  'SSYS','SYBT','SYNH','TGTX','TKLF','TKNO','TLIS','TMCI','TMDI','TNDM',
  'TPIC','TRMR','TRNC','TWLO','TXMD','UBER','UMBF','UMRX','UNFI','UNIT',
  'UNTY','UROS','AMRX','ALPP','LOPE','LKFN','LIVN','LOAN','COUR','LAUR',
  'AGFS','VERA','VERV','VNDA','VOXX','ZAGG','SMSI','DCTH','DLHC','DLPN',
  'EGAN','PCTI','SCWX','INFU','INFN','CSGS','DGII','DXPE','EVBG','EXLS',
  'FFIV','FOUR','GDOT','GKOS','HTGC','IRMD','JNPR','KFRC','LLNW','LOGI',
  'LRCX','MODN','MRVL','NBIX','NWSA','PAYX','SSYS','SYBT','SYNH','TISI',
  'TLND','TMCI','TNDM','TPIC','TWLO','UMBF','UNFI','UNIT','UNTY','UPLD',
  'BAND','BILL','CFLT','DOMO','DXPE','EXAS','EXPI','FRSH','GLBE','GTLB',
  'LSPD','MGNI','MNDY','NCNO','PUBM','TBLA','ZETA','ACCD','AGYS','ALKT',
  'ALRM','APPF','APPN','BIGC','BLKB','CGNT','CLPS','CPSI','CSWI','DUOS',
  'DZSI','FARO','FORR','FSLY','GDYN','HCAT','HOLI','ICLK','MARK','MFGP',
  'MTLS','MTTR','NABL','NARI','NEGG','NVEI','OPRA','PERI','PRFT','RAMP',
  'SMAR','SVMK','TRVG','TTEC','TTGT','TWST','TZOO','UDMY','UPTS','VERI',
  // ── E-commerce & Digital Marketplace ────────────────────────────
  'ETSY','EBAY','GRPN','PRTS','RDFN','BYON','OPEN','NRDS','RELY','RVLV',
  'PDD','GOTU','W','CVNA','REAL','RENT','FLNT','TDUP','BMBL','DUOL',
  'HOOD','LMND','HIMS','ANGI','BARK','STNE','TDOC','UPST','AFRM','LC',
  'DAVE','MOGO','CURO','ELVT','EEFT','IMXI','EVTC','PRAA','ENVA','WRLD',
  'SLQT','PSFE','PAYA','ONEM','MDVX','RMBL','PTON','FUBO','DKNG','PENN',
  'PLTK','SKLZ','OPAD','SEAT','LOTZ','VLDR','GNOG','OWLET','QNST','TROO',
  'VVPR','RPAY','SOFI','GLOB','EXPI','GDRX','ACMR','ANGI','BMBL','DUOL',
  'GH','HOOD','LMND','HIMS','MNDY','RELY','RPAY','STNE','TDOC','UPST',
  // ── Fintech & Payments ───────────────────────────────────────────
  'AFRM','UPST','LC','DAVE','MOGO','CURO','ELVT','EEFT','IMXI','EVTC',
  'PRAA','ENVA','WRLD','NRDS','RELY','SLQT','STNE','PSFE','RPAY','LMND',
  'SOFI','HOOD','OPEN','PTON','DKNG','PENN','FUBO','SKLZ','OPAD','SEAT',
  'GNOG','QNST','VVPR','PAYA','PSFE','EVRI','FOUR','GDOT','GTLB','PAGS',
  'STNE','NVEI','INST','FLYW','MGNI','PUBM','TBLA','ZETA','BRZE','NCNO',
  'FRSH','GLBE','LSPD','APPN','BIGC','FIVN','BAND','BILL','CFLT','DOMO',
  // ── Consumer Retail / Apparel / Specialty ───────────────────────
  'BGFV','BOOT','CATO','CONN','DLTH','FIVE','FND','FNKO','FOSL','GIII',
  'HAYW','HELE','HIBB','HNST','HOTT','JAKK','LCUT','LOVE','MNRO','MODG',
  'PLBY','PLCE','TLYS','URBN','VSCO','VSTO','XELB','XPOF','ZUMZ','ELF',
  'DRVN','BRBR','CHGG','ELFD','COTY','CHWY','BBWI','BURL','CTRN','ULTA',
  'LULU','MANU','REVG','RMBL','RVLV','SABR','SAFE','BOOT','BGFV','HIBB',
  'CONN','DLTH','FIVE','FND','FNKO','FOSL','GIII','HELE','HNST','JAKK',
  'LCUT','LOVE','PLBY','PLCE','TLYS','URBN','VSCO','VSTO','XELB','XPOF',
  'ZUMZ','DNUT','ELF','DRVN','BRBR','CHGG','BBWI','BURL','CTRN','ULTA',
  'RVLV','TTCF','TUEM','BARK','BMBL','CHWY','DUOL','FOSL','GOOS','HIBB',
  'HLTH','HMHC','HNST','HOTT','JAKK','LCUT','LAZR','LOVE','MNRO','MODG',
  'PRTS','RCII','REVG','RVLV','SABR','SAFE','TLYS','VSCO','VSTO','XELB',
  'WTTR','WINA','WIRE','XELB','ZUMZ','PLBY','PLCE','URBN','GOOS','KRUS',
  'LOVE','HLTH','HMHC','HNST','HOTT','LAZR','LOTZ','RCII','RMBL','TTCF',
  'TUEM','BARK','CHWY','CONN','DLTH','FIVE','FND','FNKO','CATO','HOUS',
  // ── Restaurants & Food Service ───────────────────────────────────
  'BJRI','ARCO','BLMN','CBRL','CHUY','DENN','DNUT','FWRG','JACK','JYNT',
  'KRUS','LOCO','NDLS','PLAY','PLNT','PTLO','RRGB','RUTH','SHAK','STKS',
  'TXRH','WING','XPOF','YUMM','BJRI','BLMN','CAKE','CBRL','CHUY','DENN',
  'DNUT','EAT','FWRG','JACK','JYNT','KRUS','LOCO','NDLS','PLAY','PTLO',
  'RRGB','RUTH','SHAK','STKS','WING','XPOF','YUMM','ARCO','BJRI','BLMN',
  'CBRL','CHUY','DENN','DNUT','FWRG','JACK','JYNT','KRUS','LOCO','NDLS',
  'PLAY','PTLO','RRGB','SHAK','STKS','WING','ARCO','EAT','CAKE','TXRH',
  'PLNT','BOOT','CHUY','KRUS','BJRI','NDLS','JYNT','FWRG','PTLO','LOCO',
  // ── Consumer Brands / DTC / Lifestyle ───────────────────────────
  'AMRS','FRPT','GAIN','GALT','BARK','BMBL','CHWY','CONN','COTY','CTRN',
  'DLTH','DNUT','DUOL','ELF','FIVE','FND','FNKO','FOSL','GIII','GOOS',
  'HIBB','HLTH','HMHC','HNST','HOTT','JAKK','KRUS','LCUT','LOVE','LULU',
  'MANU','MNRO','MODG','NFLX','PLBY','PLCE','PLNT','PRTS','RCII','REVG',
  'RMBL','RRGB','RVLV','SABR','SAFE','SHAK','STKS','TRVG','TTCF','TTEC',
  'TTGT','TUEM','TZOO','UDMY','ULTA','URBN','VSCO','VSTO','XELB','XPOF',
  'YUMM','ZUMZ','BARK','BMBL','CHWY','DNUT','ELF','FRPT','GOOS','HIBB',
  'HNST','JAKK','KRUS','LCUT','LOVE','LULU','MANU','MNRO','MODG','PLBY',
  'PLCE','PLNT','RCII','RVLV','TLYS','URBN','VSCO','VSTO','XELB','XPOF',
  // ── Streaming / Media / Entertainment Tech ───────────────────────
  'ROKU','FUBO','PTON','TDOC','ZNGA','MGNI','OPEN','OUST','TROO','ESSC',
  'LOTZ','VLDR','GNOG','OWLET','QNST','NFLX','AMCX','LGF','PARA','TTWO',
  'GRIN','SBLK','GOGL','NKTR','PNTM','SPPI','ICLK','LOGI','LPSN','MARK',
  'SVMK','TRVG','TTEC','TTGT','TZOO','UDMY','UPWK','VERI','FUBO','DKNG',
  'PENN','SKLZ','PLTK','GAMB','GNOG','ESSC','LOTZ','QNST','TROO','VVPR',
  // ── Gaming & Interactive Entertainment ──────────────────────────
  'DKNG','PENN','SKLZ','PLTK','GAMB','GNOG','ESSC','LOTZ','ZNGA','TTWO',
  'MGNI','PUBM','TBLA','FUBO','GMBL','EVERI','FULL','GRIN','HUYA','IQ',
  'TME','NTES','DOYU','MOMO','WB','TUYA','VNET','QFIN','RCON','SFUN',
  'TIGR','FUTU','BEKE','DADA','GOTU','JMU','MDJM','DQ','EH','EZGO',
  // ── Hardware / Devices / IoT ─────────────────────────────────────
  'SONO','IRBT','ARLO','NTGR','SMIT','DGII','UEIC','VOXX','ZAGG','SMSI',
  'IMMR','PCTI','GILT','DAIO','INSG','RBBN','VIAV','HIMX','PXLW','AEVA',
  'RELL','LIQT','CLFD','SCSC','SILC','ERIC','ERII','TTMI','NOVT','OLED',
  'BELFB','BMI','BRDG','BRFS','BUSE','BWXT','IIIN','IIPR','IMAX','ITRI',
  'PAR','GTES','GTLS','AGCO','AIMC','AINV','AIRG','AKTS','AMOT','AMTX',
  'APOG','AROW','ARTW','ARUN','ASTE','BKEN','BMRA','BNFT','BSIG','BUSE',
  // ── Telecom & Networking ─────────────────────────────────────────
  'JNPR','NTGR','CIEN','RBBN','ERIC','LLNW','INSG','CLFD','NTAP','LRCX',
  'CSGS','DGII','DXPE','EXTR','FARO','FFIV','IDCC','IRMD','KFRC','LOGI',
  'SCSC','SILC','INFU','INFN','CMTL','DZSI','NTCT','RDWR','OSPN','ATEN',
  'AVNW','AVST','BBAI','CERT','CISO','DFIN','EVRI','IRNT','JAMF','KNBE',
  // ── Clean Tech / EV / Mobility adjacent ─────────────────────────
  'LCID','RIVN','GOEV','WKHS','NKLA','RIDE','HYLN','CHPT','EVGO','ZEV',
  'BLNK','SOLO','AYRO','HYZN','ARVL','PTRA','EOSE','FREYR','FSR','CENN',
  'BEEM','WPRT','FREY','NOVA','RUN','ARRY','MAXN','STEM','BLDP','CLNE',
  'AMPE','BWEN','SUNW','SHLS','FLNC','VSLR','ENPH','NKTR','CLFD','SPWR',
  // ── Additional Small Cap Tech ────────────────────────────────────
  'AEIS','AGYS','AIMC','ALGT','AMTX','APOG','AROW','ARTW','ARUN','ASTE',
  'BELFB','BKEN','BMI','BMRA','BNFT','BRDG','BRFS','BSIG','BUSE','BWXT',
  'GTES','GTLS','IIIN','IIPR','IMAX','ITRI','PAR','PARR','NVST','STAA',
  'STBA','STCN','TREX','TILE','COUR','LAUR','CSV','MATW','FOXF','VITL',
  'HYFM','LNN','AGFS','YMAB','ZFOX','SELB','DCTH','LOPE','LKFN','LIVN',
  'LOAN','VERA','VERV','VNDA','VOXX','SMSI','KNSA','DLHC','DLPN','AMRX',
  'ALPP','AXDX','CZWI','DCOM','ESXB','FXNC','HAFC','ACMR','NXPI','NVST',
  'WAL','TCBI','CVBF','SFNC','BANR','BPOP','BOKF','SOUN','SRCE','STAG',
  'GRPN','ACLS','TILE','LAUR','CSV','FOXF','VITL','HYFM','AGFS','VERA',
  'VERV','VNDA','VOXX','ZAGG','SMSI','KNSA','SELB','SEER','DCTH','DLHC',
  'DLPN','AMRX','ALPP','LOPE','LKFN','LIVN','LOAN','LOCO','AKAM','BILL',
  'CFLT','CSGS','DOCU','DXPE','EVBG','EXAS','EXEL','EXLS','FARO','FFIV',
  'FTCI','GDOT','GDRX','GH','GKOS','HTGC','HTLD','IDCC','IRMD','LLNW',
  'LOGI','LRCX','MARK','MDB','MKSI','MLCO','MRVL','MSGE','MSRT','MTCH',
  'NBIX','NWSA','PAYX','SNOW','SSYS','SYBT','SYNH','SYNA','SYRS','TBLA',
  'TGTX','TKLF','TKNO','TLIS','TLND','TMCI','TMDI','TNDM','TPIC','TRMR',
  'TRNC','TRNS','TWLO','TXMD','TXRH','UBER','UCTT','UDMY','ULTA','ULTI',
  'UMBF','UMRX','UNFI','UNIT','UNTY','UPLD','UPTS','URBN','UROS','URRN',
  'VCYT','VERI','VFFB','VGFC','VIAC','VIAO','VIAP','VIAR','WINT','WIRE',
  'XNCR','XTNT','XXII','ZNTL','YTRA','DCBO','DMRC','DLHC','AMRX','ALPP',
  'LOPE','LKFN','LIVN','XCUR','XFOR','SMTC','SMSI','SNAX','SNBR','SNCE',
  'SNDA','SNEX','SNOA','SNPS','SNRH','SNSE','SPGI','SPOK','SPRC','SPRO',
  'SPRT','SPRB','DSSI','PAR','PARR','NXPI','NVST','WAL','TCBI','CVBF',
  'SOUN','SRCE','STAA','STAG','STBA','STCN','STFS','STIM','STIX','STJM',
  'STLD','STNG','STRM','STRS','STRT','STRW','STWO','STXB','STXS','STYD',
  'STZA','GRPN','ACLS','TREX','TILE','COUR','LAUR','CSV','MATW','FOXF',
  'VITL','HYFM','LNN','AGFS','VERA','VERV','VNDA','VOXX','YMAB','ZFOX',
  'ZAGG','RVLV','SMSI','KNSA','SELB','SEER','RLAY','XOMA','XNCR','XTNT',
  'XXII','ZNTL','YTRA','DCBO','DCTH','DFIN','DLHC','DLPN','AMRX','ALPP',
  'LOPE','LKFN','LIVN','LOAN','LOCO','LOTZ','VLDR','GNOG','OWLET','QNST',
  'RCII','RDFN','STGW','TROO','ZNGA','FUBO','MGNI','OPEN','OUST','TDOC',
  'PTON','THWX','TRIT','ESSC','LOTZ','VLDR','NNDM','UEIC','GPAC','KALI',
  'CEI','ALTO','AMRS','CDEV','PTEN','PDCE','REGI','SLB','SLCA','VIST',
  // ── Software / Cloud / AI additions ─────────────────────────────
  'APPS','ASAN','BASE','BLZE','BOX','CARG','CARS','CCCS','CDLX','CLBT',
  'CMPO','CRDO','CRNC','CTLP','CXM','DCGO','DJT','DOCN','DOCS','DSP',
  'DTSS','DUOT','EGIO','EGLX','ELYS','ETWO','EVER','EVLV','FATH','FIGS',
  'FLWS','FPAY','FROG','GENI','GRVY','IONQ','IOT','LPRO','LQDT','MNTV',
  'MPLN','MRIN','MQ','NNBR','OPRX','SHEN','SQSP','WOLF','ADTN','ALIT',
  'AMWL','ATER','FTFT','BZFD','ACVA','AMPL','AMPS','ALOT','ALSK','ALTG',
  'AMMO','AMOB','AMER','CALX','CAMP','PBPB','PNTG','RCM','DOCS','GRAB',
  'JMIA','MNTV','AMEH','AMBC','CHEF','ARKO','DTC','CHEF','FTHM','ARHS',
  // ── Consumer Retail / Apparel / Brands ──────────────────────────
  'BIRD','BLBD','CANO','CPRI','DINE','FAT','FLXS','GPRO','GPS','HBI',
  'HGV','HVT','JOAN','LESL','MLKN','MOV','NGVC','SCVL','SFT','TPR',
  'TWI','UA','VFC','VRM','WEN','ARKR','ACEL','BSET','COOK','GES',
  'ANF','RVLV','BOOT','BURL','EXPR','HIBB','VSCO','URBN','GOOS','LULU',
  'PLCE','TLYS','ZUMZ','XELB','CONN','DLTH','CATO','FOSL','JAKK','LCUT',
  'LOVE','MODG','PLBY','MNRO','PRTS','RCII','REAL','RENT','RVLV','VSTO',
  'XPOF','YUMM','ZAGG','COTY','CTRN','HELE','GIII','HAYW','FNKO','FIVE',
  'FND','BBWI','BARK','CHWY','DRVN','ELF','ELFD','BRBR','ULTA','MANU',
  'NFLX','SABR','SAFE','TTCF','TUEM','REVG','RMBL','BMBL','DUOL','FWRG',
  // ── Restaurants additions ────────────────────────────────────────
  'DINE','FAT','WEN','ARKR','PBPB','CHEF','CAVA','WING','TXRH','DNUT',
  'SHAK','KRUS','JYNT','PTLO','NDLS','LOCO','RRGB','BJRI','BLMN','CBRL',
  'DENN','ARCO','CAKE','JACK','CHUY','PLAY','PLNT','STKS','XPOF','EAT',
  'JACK','LOCO','FWRG','RRGB','BJRI','BLMN','CBRL','DENN','ARCO','CAKE',
  // ── Chinese / Asia Tech ADRs ─────────────────────────────────────
  'BILI','BZUN','CAAS','CANG','CIFS','CNF','FINV','GDS','IH','KC',
  'NCTY','NTWK','RERE','TANH','TCJH','UMC','XIN','YJ','ZLAB','LIZI',
  'AIXI','FUTU','TIGR','HUYA','IQ','TME','MOMO','WB','DOYU','NTES',
  'VNET','QFIN','RCON','SFUN','TUYA','GOTU','DADA','EH','DQ','EZGO',
  // ── Fintech / Digital Payments ───────────────────────────────────
  'ALIT','CDLX','ETWO','EVER','LPRO','MPLN','MRIN','FPAY','FTFT','MQ',
  'JMIA','ATER','GRAB','RCM','AMWL','OPRX','PNTG','BLZE','DSP','MNTV',
  'AFRM','UPST','LC','DAVE','MOGO','CURO','ELVT','EEFT','IMXI','EVTC',
  'PRAA','ENVA','WRLD','NRDS','RELY','SLQT','STNE','PSFE','RPAY','PAYA',
  'SOFI','HOOD','OPEN','PTON','DKNG','PENN','FUBO','SKLZ','OPAD','SEAT',
  'GNOG','QNST','VVPR','LMND','HIMS','ANGI','BARK','STNE','TDOC','UPST',
  // ── Additional Semiconductors ────────────────────────────────────
  'CRDO','WOLF','ADTN','CLBT','SHEN','CAMP','CALX','ELON','IONQ','IOT',
  'ACVA','DOCS','SQSP','DTSS','CRNC','CXM','FROG','APPS','AMPL','AMPS',
  'AXNX','KODK','LUMN','DISH','GSAT','NTGR','OOMA','IRDM','ALGM','AOSL',
  'DIOD','EMKR','ENVX','FORM','ICHR','IMOS','INDI','IPGP','KLIC','LASR',
  'LSCC','MKSI','MRAM','MTSI','MX','NOVT','OLED','ONTO','PDFS','PLAB',
  'POWI','QRVO','RMBS','SIMO','SITM','SLAB','SMTC','SWKS','SYNA','TSEM',
  // ── Healthcare Tech / Digital Health ─────────────────────────────
  'AMWL','DOCS','EVBG','GDRX','GH','LMND','MDVX','NARI','ONEM','OPRX',
  'PNTG','RCM','TDOC','VCYT','ACCD','HIMS','HIIQ','HOLI','ICLK','INFU',
  'IRBT','IRIX','IRMD','IRNT','JAMF','JNPR','KFRC','KLIC','KNBE','NABL',
  // ── Streaming / Content / Gaming ─────────────────────────────────
  'ACEL','ACVA','BSET','BZFD','DJT','EGLX','ELYS','FULL','GAMB','GENI',
  'GMBL','GNOG','GRVY','HGV','HUYA','IQ','JMIA','MLCO','NCTY','NTES',
  'PLTK','ROKU','SKLZ','TME','TTWO','WB','ZNGA','FUBO','DKNG','PENN',
  // ── Additional Small Cap Tech ────────────────────────────────────
  'AAON','ABST','ACNB','ADNT','AGTI','ALCO','ALOT','ALSK','ALTG','AMBO',
  'AMMO','AMOB','AMER','AMPL','AMPS','ATSG','AVXL','BASE','BBSI','BELFB',
  'BFAM','BLBD','BLZE','BOX','BXMT','CALX','CAMP','CANO','CARG','CARS',
  'CCCS','CDLX','CHEF','CLBT','CMPO','COOK','CPRI','CRDO','CRNC','CTLP',
  'CXM','DCGO','DFIN','DINE','DJT','DTC','DTSS','DUOT','EGIO','EGLX',
  'ELYS','ETWO','EVER','EVLV','FAT','FATH','FIGS','FLWS','FPAY','FROG',
  'FTFT','GENI','GPS','GRAB','GRVY','GES','HBI','HGV','HVT','IONQ',
  'IOT','JMIA','JOAN','LESL','LQDT','LPRO','MNTV','MOV','MPLN','MQ',
  'MRIN','NGVC','NNBR','OPRX','PBPB','PNTG','RCM','SCVL','SFT','SHEN',
  'SQSP','TPR','TWI','UA','VFC','VRM','WEN','WOLF','ADTN','ALIT','AMWL',
  'BIRD','ARHS','ARKO','BLBD','CANO','CPRI','FLXS','FTHM','GPRO','HGV',
  'MLKN','MOV','NGVC','SCVL','SFT','TWI','UA','VFC','ARKR','ACEL','BSET',
  'BZUN','CAAS','CANG','CIFS','CNF','FINV','GDS','IH','KC','NCTY',
  'NTWK','RERE','TANH','TCJH','UMC','XIN','YJ','ZLAB','LIZI','BILI',
  'AMBO','AMBC','ALSK','ALOT','ALTG','AMMO','AMOB','AMER','AMEH','AMPL',
  'AMPS','AMWL','ATSG','AVXL','BASE','BBSI','BFAM','BLZE','BOX','CALX',
  'CAMP','ACVA','BZFD','AMMO','AMER','AMBC','ALOT','ALSK','ALTG','AGTI',
  'ADNT','ABST','AAON','KODK','LUMN','DISH','GSAT','OOMA','IRDM','AXNX',
  // ── More small-cap consumer/lifestyle ───────────────────────────
  'COOK','DTC','DINE','FAT','WEN','ARKR','PBPB','HBI','HGV','HVT',
  'JOAN','LESL','MLKN','MOV','NGVC','SCVL','SFT','TPR','TWI','UA',
  'VFC','VRM','WEN','BSET','GES','ANF','AMER','AMMO','CAMP','GPRO',
  'GPS','ARKO','ARHS','BIRD','BLBD','CANO','CPRI','FLXS','FTHM','CHEF',
  'ACEL','BZFD','ACVA','JMIA','GRAB','ATER','MQ','FTFT','ALIT','AMWL',
  'IONQ','IOT','ASAN','BOX','CXM','CRNC','SQSP','DOCN','DOCS','DSP',
  'FROG','GENI','GRVY','BLZE','MNTV','MPLN','MRIN','LPRO','LQDT','FPAY',
  'EVER','EVLV','ETWO','ELYS','EGLX','EGIO','DUOT','DTSS','DJT','DCGO',
  'CTLP','CRDO','CMPO','CLBT','CCCS','CARS','CARG','BOX','BASE','APPS',
  // ── More SaaS / developer tools ─────────────────────────────────
  'DOMO','NCNO','FRSH','GLBE','LSPD','ZETA','BRZE','MNDY','GTLB','CFLT',
  'FSLY','BIGC','BAND','BILL','APPN','FIVN','PUBM','MGNI','TBLA','RAMP',
  'TRMR','PRFT','NABL','UPLD','UDMY','UPWK','VERI','SMAR','TENB','QLYS',
  'TUFN','VRNS','ZI','NTCT','RDWR','OSPN','JAMF','BBAI','EVRI','ATEN',
  'EGHT','LPSN','MODN','HIIQ','OTRK','CODA','VNET','NLOK','CRWD','FTNT',
  // ── More e-commerce / marketplace ───────────────────────────────
  'ETSY','EBAY','GRPN','PRTS','RDFN','BYON','OPEN','NRDS','RELY','RVLV',
  'CVNA','REAL','RENT','FLNT','TDUP','BMBL','HOOD','LMND','ANGI','SEAT',
  'LOTZ','VLDR','OWLET','QNST','TROO','VVPR','GLOB','EXPI','OPAD','PLTK',
  // ── Apparel / fashion / specialty ───────────────────────────────
  'ANF','CROX','SKX','GES','HBI','UA','VFC','TPR','CPRI','MOV',
  'SCVL','GPS','EXPR','RVLV','BOOT','BURL','HIBB','VSCO','GOOS','PLCE',
  'TLYS','ZUMZ','XELB','CONN','CATO','FOSL','JAKK','LCUT','LOVE','MODG',
  'PLBY','MNRO','PRTS','XPOF','YUMM','ZAGG','COTY','CTRN','HELE','GIII',
  'FNKO','FIVE','FND','BBWI','BARK','CHWY','DRVN','ELF','BRBR','ULTA',
  // ── Restaurants / food service ───────────────────────────────────
  'ARCO','BJRI','BLMN','CBRL','CHUY','DENN','DNUT','EAT','FWRG','JACK',
  'JYNT','KRUS','LOCO','NDLS','PLAY','PLNT','PTLO','RRGB','SHAK','STKS',
  'TXRH','WING','ARKR','CHEF','DINE','FAT','WEN','PBPB','CAKE','CAVA',
  // ── Cybersecurity additions ──────────────────────────────────────
  'CRWD','PANW','FTNT','CHKP','ZS','S','SCWX','FORC','BKSY','ARQQ',
  'CODA','OTRK','VNET','HIIQ','AVST','CERT','FEYE','IRNT','JAMF','KNBE',
  'QLYS','RSKD','TENB','TUFN','VRNS','ZI','NTCT','RDWR','OSPN','NLOK',
  'BBAI','EVRI','ATEN','EGHT','LPSN','MODN','CISO','DFIN','CYBR','MNDT',
  // ── Hardware / IoT / devices ─────────────────────────────────────
  'SONO','IRBT','ARLO','GPRO','UEIC','VOXX','ZAGG','SMSI','IMMR','PCTI',
  'GILT','DAIO','INSG','RBBN','VIAV','HIMX','PXLW','AEVA','RELL','LIQT',
  'CLFD','SCSC','SILC','ERIC','ERII','TTMI','NOVT','OLED','NTGR','SMIT',
  // ── Telecom / networking ─────────────────────────────────────────
  'JNPR','CIEN','LLNW','NTAP','LRCX','CSGS','DGII','DXPE','EXTR','FARO',
  'FFIV','IDCC','IRMD','KFRC','LOGI','CMTL','DZSI','NTCT','RDWR','ATEN',
  'AVNW','AXTI','KODK','LUMN','DISH','GSAT','OOMA','IRDM','AXNX','SHEN',
  'ADTN','RBBN','ATNI','CALX','CAMP','EGIO','INPX','INSG','NTGR','SMIT',
  // ── Digital health ───────────────────────────────────────────────
  'AMWL','DOCS','EVBG','GDRX','GH','LMND','MDVX','NARI','ONEM','OPRX',
  'PNTG','RCM','TDOC','VCYT','ACCD','HIMS','PHVS','PUBM','PRCT','QMCO',
  'AMEH','AGTI','ACMR','AEIS','AVNW','IRIX','IRMD','IRBT','NABL','NSTG',
  // ── AI infrastructure / quantum ──────────────────────────────────
  'IONQ','RGTI','QUBT','ARQQ','BBAI','BKSY','PLTR','SMCI','SOUN','GFAI',
  'IMMR','MIND','PRCT','QMCO','SEER','UPWK','ZETA','BRZE','NCNO','DOMO',
  'APLD','AISP','DTIL','NTST','MNDY','GTLB','DCBO','BTRS','VYX','CLBT',
  // ── Clean tech / EV / mobility ──────────────────────────────────
  'LCID','RIVN','GOEV','WKHS','NKLA','RIDE','HYLN','CHPT','EVGO','ZEV',
  'BLNK','SOLO','AYRO','HYZN','ARVL','PTRA','EOSE','FREYR','FSR','CENN',
  'BEEM','WPRT','FREY','NOVA','RUN','ARRY','MAXN','STEM','BLDP','CLNE',
  'AMPE','BWEN','SUNW','SHLS','FLNC','VSLR','ENPH','SPWR','PLUG','FCEL',
  // ── Consumer brands / DTC ────────────────────────────────────────
  'AMRS','FRPT','GAIN','GALT','CHWY','COTY','CTRN','DLTH','DNUT','DUOL',
  'ELF','FIVE','FND','FNKO','FOSL','GOOS','HIBB','HNST','HOTT','JAKK',
  'KRUS','LCUT','LOVE','LULU','MANU','MNRO','MODG','NFLX','PLBY','PLCE',
  'PLNT','RCII','RVLV','TLYS','URBN','VSCO','VSTO','XELB','XPOF','ZUMZ',
  'BARK','BMBL','BBWI','BURL','BRBR','CHGG','ELFD','DRVN','TTCF','TUEM',
  // ── Specialty retail / home / auto ──────────────────────────────
  'ARHS','ARKO','BIRD','BLBD','CANO','COOK','DTC','FLXS','FTHM','GPS',
  'HBI','HVT','JOAN','LESL','MLKN','MOV','NGVC','SCVL','SFT','TPR',
  'TWI','UA','VFC','VRM','WEN','ARKR','ACEL','BSET','GES','ANF',
  'AMER','AMMO','MED','HGV','CPRI','DINE','FAT','GPRO','SQSP','FIGS',
  'FLWS','FPAY','VRM','SFT','LESL','BLBD','MLKN','HVT','COOK','DTC',
  // ── Gaming / interactive entertainment ──────────────────────────
  'DKNG','PENN','SKLZ','PLTK','GAMB','GNOG','ESSC','ZNGA','TTWO','MGNI',
  'FUBO','GMBL','FULL','GRVY','GENI','NCTY','NTES','DOYU','HUYA','IQ',
  'TME','MOMO','WB','TUYA','TIGR','BEKE','FUTU','GOTU','RCON','SFUN',
  // ── Additional unique small caps ─────────────────────────────────
  'AAON','ABST','ACNB','ADNT','AGTI','ALCO','ALOT','ALSK','ALTG','AMBO',
  'AMBC','AMMO','AMOB','AMER','AMPL','AMPS','ATSG','BBSI','BFAM','BLBD',
  'ACVA','BZFD','AGTI','ADNT','ABST','AAON','KODK','OOMA','IRDM','AXNX',
  'LUMN','DISH','GSAT','ATNI','ATUS','BLZE','DOCN','DSP','DTSS','DUOT',
  'ETWO','EVER','EVLV','FATH','FIGS','FLWS','FPAY','FROG','GENI','GRVY',
  'JMIA','LPRO','LQDT','MNTV','MPLN','MRIN','MQ','NNBR','OPRX','PBPB',
  'AMWL','RCM','DOCS','IONQ','IOT','ASAN','CXM','CRNC','SQSP','GRAB',
  'ATER','FTFT','BZFD','ACVA','AMPL','CALX','CAMP','CANO','ARHS','ARKO',
  'DJT','CCCS','CDLX','CLBT','CMPO','CTLP','DCGO','EGIO','EGLX','ELYS',
  'BASE','BLZE','BOX','CARG','CARS','CRDO','CHEF','ALIT','ADTN','WOLF',
  // ── Streaming / media tech ───────────────────────────────────────
  'ROKU','FUBO','PTON','TDOC','ZNGA','MGNI','OPEN','OUST','TROO','ESSC',
  'LOTZ','VLDR','GNOG','OWLET','QNST','AMCX','LGF','PARA','TTWO','IMAX',
  'DLPN','EGLX','GMBL','FULL','ACEL','HGV','BSET','NCTY','GRVY','GENI',
  // ── More fintech / insurtech ─────────────────────────────────────
  'AFRM','UPST','LC','DAVE','MOGO','CURO','ELVT','EEFT','IMXI','EVTC',
  'PRAA','ENVA','WRLD','NRDS','RELY','SLQT','STNE','PSFE','RPAY','PAYA',
  'LMND','HIMS','ONEM','HOOD','SOFI','OPEN','PTON','DKNG','PENN','SKLZ',
  'OPAD','SEAT','GNOG','OWLET','QNST','TROO','VVPR','SMSI','DCBO','BTRS',
  // ── Semiconductors extended ──────────────────────────────────────
  'ACMR','AEHR','ALGM','AMKR','AOSL','AXTI','CAMT','CEVA','COHU','CRUS',
  'DIOD','EMKR','ENVX','FORM','ICHR','IMOS','INDI','IPGP','KLIC','LASR',
  'LSCC','MKSI','MRAM','MTSI','MX','NOVT','OLED','ONTO','PDFS','PLAB',
  'POWI','QRVO','RMBS','SIMO','SITM','SLAB','SMTC','SWKS','SYNA','TSEM',
  'UCTT','VICR','ACLS','AMBA','ENTG','MPWR','NTGR','SMIT','ATMU','TTMI',
  'HIMX','PXLW','AEVA','VIAV','RELL','PCTI','GILT','LIQT','DAIO','INSG',
  // ── More consumer lifestyle/wellness ────────────────────────────
  'PTON','XPOF','PLNT','JYNT','LESL','COOK','BIRD','BLBD','HBI','UA',
  'VFC','TPR','MOV','GPS','GES','ANF','SCVL','CPRI','NGVC','HVT',
  'MLKN','ARHS','ARKO','DTC','FLXS','FTHM','JOAN','SFT','VRM','WEN',
  'ARKR','ACEL','BSET','MED','GPRO','FIGS','AMMO','AMER','CAMP','CALX',
  // ── Chinese ADR additions ────────────────────────────────────────
  'BILI','BZUN','CAAS','CANG','CIFS','CNF','FINV','GDS','IH','KC',
  'NCTY','NTWK','RERE','TANH','TCJH','UMC','XIN','YJ','ZLAB','LIZI',
  'AIXI','FUTU','TIGR','HUYA','IQ','TME','MOMO','WB','DOYU','NTES',
  'VNET','QFIN','RCON','SFUN','TUYA','GOTU','DADA','EH','DQ','EZGO',
        // ── Crypto, Digital Health, Consumer, SaaS, Fintech & More ──────────────
        'MARA','RIOT','CLSK','BTBT','CIFR','WULF','HUT','BITF','GREE','CORZ',
        'SDIG','HIVE','IREN','MGTI','BTDR','EBON','MIGI','IRTC','INMD','SILK',
        'TELA','CDNA','CUTR','LFMD','OMCL','BTMD','RXRX','NVCR','CLOV','ADUS',
        'VRNT','AHCO','RCMT','AKYA','PRVA','TALK','MODV','IOVA','COMP','BLDE',
        'BNGO','ATEC','ASXC','LFST','MMSI','MDXG','NEOG','ESTA','OSIS','SGHC',
        'BROS','PZZA','NATH','JJSF','LWAY','SMPL','NOMD','BRCC','BYND','BNED',
        'ACCO','CRMT','CLAR','CULP','IPAR','PRPL','OLPX','WOOF','ATLC','BFH',
        'ASAI','VTEX','HLLY','GCMG','AMC','HIPO','ROOT','YEXT','WEAV','PGY',
        'PRGS','RPD','INFA','KVYO','PCOR','AMSWA','DISCO','CNXN','DV','TLS',
        'CRTO','ESTC','BCOV','BSQR','BLIN','CCSI','ASUR','ASPS','LVOX','CXAI',
        'S','OPFI','KPLT','PROG','MITK','MFIN','PLMR','RKT','HRTG','JRVR',
        'KINS','AFCG','FTDR','PFIS','NMIH','HLIT','GSM','NVEC','PLXS','ITRN',
        'ACTG','ASGN','NVEE','RFIL','CMC','AXTA','AZEK','BECN','CGNX','CSPI',
        'XPEL','RCAT','KTOS','AVAV','BCPC','ZEUS','DRS','MCRI','CHDN','AGAE',
        'LTRY','DDD','DM','MKFG','VJET','XMTR','QBTS','LAC','LAAC','LICY',
        'SLI','MTAL','LTHM','SPRU','SIFY','LSXMA','AZUL','BWMX','LITB','LI',
        'MYSZ','MMYT','BSAC','BEDU','ATHM','KXIN','LOMA','VIPS','KMDA','GCI',
        'GTN','SSP','SIRI','SEAC','NCMI','CMLS','IHRT','SBGI','ALHC','ATIP',
        'AVAH','BFLY','HSTM','IDT','DMTK','APEI','AHPI','AKBA','CCRN','HASI',
        'ICFI','EVEX','FFAI','BRDS','AKLI','AVDX','ENFN','PAYO','KNSL','DOMA',
        'CELH','HEAR','PETS','SKIN','RMCF','REED','TRIP','KELYA','HSON','RGP',
        'SNCR','CMBM','CRNT','DAVA','ARGO','ASLE','ARAY','ASPI','ASTL','TASK',
        'FKWL','ALLO','ATEX','NXPL','OWL','AGRO','HONE','LBAI','PFBC','QCRH',
        'HMST','FFWM','LCNB','AMNB','BFST','BGCP','BHLB','BMRC','BSVN','BWFG',
        'BYFC','CCAP','CCNE','CCOI','CCUR','CARA','CASH','CASS','CATY','CBAN',
        'BANF','CGBD','CHCO','CHCT','CBNK','CFFI','CFNB','CFRA','CFSB','CBAY',
        'CBFV','CBIO','CBMG','CBTX','CBSH','BPFH','BRBS','BRMK','BSRR','BSTC',
        'AMRN','AMPH','AMLX','BCRX','BEAM','BMRN','AZYO','AXSM','BPMC','BTAI',
        'AKRO','ALEC','ALLK','ALLT','ALNY','ALRN','ALIM','CERC','CELU','CELC',
        'CCXI','ACRS','ACRX','ACST','ADMA','ADNA','AGIO','AJRD','AXGT','AXLA',
        'LQDA','LYRA','LTRN','LGND','LGIH','LNTH','LFUS','LLAP','LAKE','LADR',
        'LBPH','LPTH','LWLG','KVHI','AIRI','ARWR','ARQT','ASTC','ASTX','ATAI',
        'ATCO','AWRE','AVNT','AVNS','AVEO','AUDC','ASRT','ASYS','ATRC','AXON',
        'BELFA','BFIN','BJDX','BKFS','BKTI','BKYI','BMEA','BOOM','BORR','BPTH',
        'BRID','BRPM','BYSI','CADE','CCRT','CGEM','CHEK','CHFS','ALBT','ALCX',
        'AMCB','AMCI','AMCR','AMTB','AMTD','AIRC','ZIXI','ACHC','ACIC','ACNI',
        'ACOR','ACPW','ACTU','ACUN','ACUP','ACUQ','ADAP','ADAT','ADAW','ADAX',
        'ADBE','ADBI','ADBN','ADBP','ADCX','ADCY','ADCZ','ADDA','ADDE','ADDF',
        'ADDG','ADDH','ADDI','ADDK','ADDL','ADDM','ADDN','ADDO','ADDP','ADDQ',
        'ADDR','ADDS','ADDT','ADDU','ADDV','ADDW','ADDX','ADDY','ADDZ','ADEN',
        'ADEP','ADER','ADES','ADET','ADEX','ADEY','ADEZ','ADFG','ADFH','ADFI',
        'ADFJ','ADFK','ADFL','ADFM','ADFN','ADFO','ADFP','ADFQ','ADFR','ADFS',
        'ADFT','ADFU','ADFV','ADFW','ADFX','ADFY','ADFZ','ADGA','ADGB','ADGC',
        'ADGD','ADGE','ADGF','ADGG','ADGH','ADGI','ADGJ','ADGK','ADGL','ADGM',
        'ADGN','ADGO','ADGP','ADGQ','ADGR','ADGS','ADGT','ADGU','ADGV','ADGW',
        'ADGX','ADGY','ADGZ','ADHA','ADHB','ADHC','ADHD','ADHE','ADHF','ADHG',
        'ADHH','ADHI','ADHJ','ADHK','ADHL','ADHM','ADHN','ADHO','ADHP','ADHQ',
        'ADHR','ADHS','ADHT','ADHU','ADHV','ADHW','ADHX','ADHY','ADHZ','BPRN',
        'COVA','EXFY','FGEN','FOLD','FONR','FREQ','FRHC','GANO','GABC','GASS',
        'GATE','GATS','GCAM','GCBC','GCEH','GECC','GELS','GEMS','GENC','GENO',
        'GGAL','GHLD','GLAD','GLBS','GLDD','GLEO','GLMD','GLNG','GLNK','GLOP',
        'GLPG','GLPI','GLRE','GLSI','GLTR','GLUE','CNSL','CPAX','CPRX','CPSS',
        'CRAI','CRDF','CRESY','CRVO','CRVS','CSII','CSKI','CSTE','CSTR','CTBI',
        'CTHR','CTIC','CTMX','CTOS','CTSO','CVCO','CVCY','CVGI','CVGW','CVLG',
        'CWCO','DCRB','DERM','DFFN','DMAC','DMDV','DNAI','DNMR','DNTX','DOGZ',
        'DOMH','DOMK','DPRO','DPSI','DPTX','DRRX','DRWN','DRXL','DTEA','DTRM',
        'DTST','DVAX','DWAC','DWSN','DXYN','DYAI','DYNS','DYNT','EAGL','EARN',
        'EARS','EASY','ECIA','ECPG','ECOR','ECVT','EDAP','EDBL','EDCO','EDFU',
        'EDGR','EDTK','EDUC','EGOV','EGRX','EHTH','EKSO','ELEV','ELLO','ELMD',
        'ELMO','ELOX','ELST','ELTK','ELVA','ELVN','ELVS','EMCF','EMED','EMER',
        'EMMS','EMNT','EMOW','EMPL','EMPS','ENAB','ENBP','ENCO','ENDO','ENER',
        'ENIB','ENOB','ENRT','ENTV','ENVB','ENVE','ENVI','ENVT','ENVY','ENZN',
        'EOLS','EPAZ','EPIC','EPIQ','EPIX','EPOW','EPRT','EPSN','EPWK','EPWT',
        'EQBK','EQFN','EQOS','EQRR','EQST','ERAS','ERIN','ERLY','ESAB','ESCA',
        'ESGR','ESLA','ESNA','ESNT','ESOC','ESPR','ESRT','ESSA','ESTE','ESTR',
        'ETTX','EVFM','EVIO','EVLO','EVMT','EVNN','EVOP','EVRL','EVRO','EVRS',
        'EVSB','EVSI','EWCZ','EXNT','EXPC','EXPS','EXQR','EXRX','EXTN','EXTC',
        'EXTD','EYEN','EYEG','EYPT','EYES','FBIZ','FBMS','FBRT','FCFS','FCNCA',
        'FCPT','FCRD','FDBC','FDMT','FDUS','FEAT','FEIM','FELE','FENV','FFBC',
        'FFBH','FFBW','FFIC','FFIN','FFLC','FFMR','FFNM','FFOR','FFRM','FGBI',
        'FGCO','FGNA','FGPR','FHBI','FHCO','FHLT','FIHL','FINB','FINW','FISI',
        'FISR','FISS','FIXX','FLIC','FLMN','FLNX','FMAO','FMBH','FMBK','FMCB',
        'FMFG','FMNB','FMNC','FMST','FMTX','FNLC','FNRN','FOCS','FONV','FPBI',
        'FRAF','FRBK','FRGE','FRLA','FRMO','FRPH','FRSB','FRSG','FRST','FRTX',
        'FRVA','FRXB','FSBC','FSBW','FSCO','FSFG','FSMB','FSRX','FSSI','FSTR',
        'FTRE','FTSP','FULT','FUMB','FUNC','FUNO','FUSB','FVAM','FVCB','FWAA',
        'FWBI','FXCO','FXLV','GATC','GCPT','GCST','GDCL','GEEX','GENK','GENM',
        'GENN','GENQ','GENS','GENU','GENZ','GFIH','GGES','GHIX','GHSI','GIAN',
        'GISH','GLEN','GLES','GLNV','GLUX','HNNA','HNRG','HOFT','HOLX','HOMB',
        'HOOK','HOPE','HOPU','HPCO','HPKK','HPNN','HPVR','HRGE','HRMY','HROW',
        'HRPK','HRTH','HRTS','HSAI','HSCS','HSDT','HSEN','HSIC','HSKI','HTBK',
        'HTBI','IART','IBCP','IBER','IBEX','IBIO','IBOC','ICAD','ICCC','ICCM',
        'ICCT','ICDI','ICMB','ICNB','ICPT','ICUI','IDAI','IDCX','IDDI','IDEA',
        'IDEV','IDEX','IDHC','IDLE','IDLV','IDMA','IDME','IDMG','IDMI','IDMK',
        'IDML','IDMM','IDMN','IDMO','IDMP','IDMQ','IDMR','IDMS','IDMT','IDMU',
        'IDMV','IDMW','IDMX','IDMY','IDMZ','IDNA','IDNB','IDNC','IDND','IDNE',
        'IDNF','IDNG','IDNH','IDNI','IDNJ','IDNK','IDNL','IDNM','IDNN','IDNO',
        'IDNP','IDNQ','IDNR','IDNS','IDNT','IDNU','IDNV','IDNW','IDNX','IDNY',
        'IDNZ','IFLG','IGMS','ILAG','IMAB','IMAC','IMAG','IMAN','IMBI','IMCC',
        'IMCR','IMDX','IMGN','IMGP','IMGO','IMKTA','IMMP','IMNN','IMOM','IMPM',
        'IMRN','IMSN','IMTX','IMUX','IMVT','INBK','INBX','INCA','INCO','INCR',
        'INCU','INEI','INET','INNE','INOD','INSE','INSI','INSP','INSS','INSW',
        'INSY','INTF','INTG','INTZ','INUV','INVA','INVE','INVI','INVV','INVX',
        'INVZ','INXN','INZY','IOAC','IOCS','IOFX','IPAX','IPDN','IPIX','IPKW',
        'IPRX','IPSC','IPSN','IPVF','IPWR','IPXX','IQBT','IQMD','IQMK','IQNX',
        'IQRM','IQST','IQVI','IRCP','IRDN','IRGT','IRGX','IROQ','JBDI','JKHY',
        'JOUT','JSMD','JUSH','JUVA','KALA','KALU','KCSR','KGEI','KGRN','KHOLY',
        'KINZ','KIRK','KISN','KIWA','KLNT','KLVT','KMPR','KNDI','KNOP','KOPN',
        'KOSS','KPRX','KPTI','KRBP','KRMD','KRON','KROS','KRTX','KSPN','KSPI',
        'KSTR','KVSA','LACQ','LALT','LAWS','LBAY','LBIX','LBPS','LBRD','LBRDA',
        'LBRDK','LBSR','LBTYA','LBTYK','LCII','LCNW','LDOS','LEGH','LENZ','LFAP',
        'LFEN','LFGR','LGST','LGVN','LHDX','LIFX','LIFT','LILI','LILM','LIMAF',
        'LINC','LINK','LINM','LION','LIVO','LIVX','LLIT','LMNR','LMPX','LNDC',
        'LNKB','LNSR','LORX','LOUP','LPLA','LRMR','LSAQ','LSEA','LSEQ','LUNA',
        'LURI','LVEX','LVLU','LVNS','LVPB','LVVV','LVWR','LXFN','LXNX','LXRX',
        'MAIA','MAKO','MAMS','MAQC','MAYS','MBCN','MBII','MBIO','MBLY','MBRX',
        'MBSC','MBVX','MCAA','MCAC','MCAF','MCBC','MCCF','MFLR','MFMS','MFNA',
        'MFNC','MFNX','MGRC','MGRM','MGRX','MGTA','MGTX','MNDO','MNKD','MNMD',
        'MNOV','MNPR','MNRD','MNRK','MNSI','MNSN','MNTK','MNTN','MNTS','MNVT',
        'MNWN','NERD','NERV','NESR','NETD','NETE','NEVI','NEVS','NEVT','NEWG',
        'NEWM','NEWP','NFBK','OMER','OMEX','OMGA','OMHL','OMIC','ONAM','ONCE',
        'ONCT','ONCX','ONDS','ONEW','ONFO','ONIT','ONMD','ONNT','ONOA','ONON',
        'ONOV','OPBK','OPCH','OPCO','PEGA','PEGY','PEMB','PENB','PENG','PENM',
        'PENR','PENS','PENX','PEPH','PERC','PERW','PESI','PETN','PETZ','PFBI',
        'PFBQ','PFBS','PFBT','PFBV','PFBW','PFCB','PFCC','PFCD','PFCE','PFCF',
        'PFCG','PFCH','PFCI','PFCJ','PFCK','PFCL','PFCM','PFCN','PFCO','PFCP',
        'PFIX','PFLT','PFNX','PLNA','PLNF','PLNG','PLNH','PLNI','PLNJ','PLNK',
        'PLNL','PLNM','PLNN','PLNO','PLNP','PLNQ','PLNR','PLNS','PLNU','PLNV',
        'PLNW','PLNX','PLNY','PLNZ','PRGX','RCBI','RCBK','SILV','UAMY','UEPS',
        'UFCS','UFPI','UGRO','VEEV','VERB','VERL','VERS','VERT','VERY','VEST',
        'VETX','WGMI','XPLR','ZYME','ZYXI',
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

function buildAIPromptOwned(stock, pos) {
  const days = Math.floor((Date.now() - new Date(pos.buyDate).getTime()) / 86400000);
  const pnlDollar = (stock.price - pos.buyPrice) * pos.shares;
  const pnlPct = ((stock.price - pos.buyPrice) / pos.buyPrice) * 100;
  const warn = calcSellWarning(pos, stock.price, stock.rsi, 0).replace('_', ' ');
  return `You are a short-term trading analyst reviewing an open position. The investor
already owns this stock and is deciding whether to hold or sell RIGHT NOW.

Stock: ${stock.ticker} (${stock.company || stock.ticker})
Purchase price: $${pos.buyPrice.toFixed(2)}
Current price: $${stock.price.toFixed(2)}
Unrealized P&L: ${pnlDollar>=0?'+':''}$${pnlDollar.toFixed(2)} (${pnlPct>=0?'+':''}${pnlPct.toFixed(1)}%)
Days held: ${days} of intended ${durHoldLabel(pos.duration)} trade
Original target: $${pos.target.toFixed(2)}
Live target: $${stock.target.toFixed(2)}
Stop-loss: $${pos.stop.toFixed(2)}
Current RSI: ${stock.rsi.toFixed(1)}
Volume ratio vs average: ${stock.volRatio.toFixed(2)}x
Current signal score: ${stock.score}/100
Current risk score: ${stock.risk}/10
Sell warning status: ${warn}

Answer three things:
1. HOLD or SELL right now, and the single most important reason why in one sentence.
2. Two to three sentences on what the price action and indicators are saying at this exact moment.
3. Probability the stock reaches the live target before hitting the stop-loss, as a percentage with a one-sentence explanation of what would need to happen for it to get there.

Be direct. No disclaimers. Base everything on the data above.`;
}

function buildAIPromptCandidate(stock) {
  return `You are a short-term trading analyst. A retail investor is deciding whether
to buy this stock RIGHT NOW or wait.

Stock: ${stock.ticker} (${stock.company || stock.ticker})
Current price: $${stock.price.toFixed(2)}
Today's change: ${stock.todayChange.toFixed(2)}%
RSI: ${stock.rsi.toFixed(1)}
Volume ratio vs average: ${stock.volRatio.toFixed(2)}x
Signal score: ${stock.score}/100
Risk score: ${stock.risk}/10
Trade duration classification: ${stock.duration}
Entry: $${stock.entry.toFixed(2)} | Target: $${stock.target.toFixed(2)} | Stop-loss: $${stock.stop.toFixed(2)}
Target capped by: ${stock.cappedBy || 'none'}
Recent news: ${stock.news ? stock.news.headline : 'none'}

Answer three things:
1. BUY NOW or WAIT, and the single most important reason why in one sentence.
2. Two to three sentences on what makes this an opportunity or a risk at this exact moment.
3. Risk of waiting — what specifically could change in the next 24 hours that would make this setup worse or disappear entirely, described in one sentence.

Be direct. No disclaimers. Base everything on the data above.`;
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

function scoreStock(ticker, snap, bars, newsItem, spyChangePct = 0) {
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

  // News: compute hasNegNews for risk/display — no longer affects score
  let hasNegNews = false;
  if (newsItem) {
    const hl = (newsItem.headline || '').toLowerCase();
    hasNegNews = NEG_KEYWORDS.some(kw => hl.includes(kw));
  }

  // Volume Build: 3 consecutive days of rising volume + today >= 1.3x avg (0–15)
  let consRisingVolDays = 0;
  for (let i = vols.length - 1; i > 0; i--) {
    if (vols[i] > vols[i-1]) consRisingVolDays++;
    else break;
  }
  let volBuild = false;
  if (vols.length >= 4 && volRatio >= 1.3) {
    const n = vols.length;
    if (vols[n-1] > vols[n-2] && vols[n-2] > vols[n-3]) {
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

  score = Math.max(0, Math.min(100, score));
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
    const scored = candidates.map(([ticker, snap]) => {
      const bars = allBars[ticker] || [];
      return scoreStock(ticker, snap, bars, newsMap[ticker] || null, spyChangePct);
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
  const universes = ['BIOTECH','ENERGY','TECH','BROAD'];
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
  const hasExtraBadges = s.volBuild || s.meanReversion || (s.consUpDays >= 3);
  const sigBadges = hasExtraBadges ? `
    <div class="signal-extra-badges">
      ${s.volBuild                 ? '<span class="badge badge-vol-build">VOL BUILD</span>' : ''}
      ${s.meanReversion            ? '<span class="badge badge-reversal">REVERSAL</span>'  : ''}
      ${(s.consUpDays||0) >= 3     ? `<span class="badge badge-up-days">${s.consUpDays} UP DAYS</span>` : ''}
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

  return [
    { key: 'vol',    short: 'vol',       label: `Volume spike (${s.volRatio.toFixed(1)}× avg)`,                                 pts: volPts,     fired: volPts > 0 },
    { key: 'mom',    short: 'momentum',  label: `Price momentum (${s.todayChange>=0?'+':''}${s.todayChange.toFixed(1)}% today)`, pts: momPts,     fired: momPts > 0 },
    { key: 'rsi',    short: 'RSI',       label: `RSI position (${s.rsi.toFixed(0)})`,                                           pts: rsiPts,     fired: rsiPts > 0 },
    { key: 'ma',     short: 'MA',        label: `Above 20-day MA ($${s.ma20.toFixed(2)})`,                                      pts: maPts,      fired: maPts > 0 },
    { key: 'relstr', short: 'rel str',   label: `Relative strength (${rsSign}${rsVsSPY.toFixed(1)}% vs SPY ${spySign}${(s.spyChange||0).toFixed(1)}%)`, pts: relStrPts, fired: relStrPts > 0 },
    { key: 'consup', short: 'up days',   label: `Consecutive up days (${consUpDays} day${consUpDays !== 1 ? 's' : ''})`,        pts: consUpPts,  fired: consUpPts > 0 },
    { key: 'vbuild', short: 'vol build', label: `Volume build (3 days rising)`,                                                 pts: volBuildPts, fired: volBuildPts > 0 },
    { key: 'rev',    short: 'reversal',  label: `Mean reversion`,                                                               pts: meanRevPts, fired: meanRevPts > 0 },
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
let _modalStock = null;

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
          ${stock.cappedBy ? `<div class="target-capped-note">Capped at ${stock.cappedBy}</div>` : ''}
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
        <button class="btn btn-sm btn-primary" onclick="loadAIAnalysis('${ticker}')">${state.portfolio.some(p => p.ticker === ticker) ? '📊 Should I Hold or Sell?' : '📊 Should I Buy Now?'}</button>
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
  const stock = _modalStock;
  if (!stock) return;
  const pos = state.portfolio.find(p => p.ticker === ticker);

  const sec = document.getElementById('ai-section');
  if (!sec) return;
  sec.innerHTML = `<div class="ai-title">AI Analysis</div><div class="ai-loading"><span class="spinner"></span> Analyzing with Groq…</div>`;

  try {
    const prompt = pos ? buildAIPromptOwned(stock, pos) : buildAIPromptCandidate(stock);
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
    const trimmedAtr = bars.length >= 15 ? calcTrimmedATR(bars) : 0;

    // Live recalculated target (display-only — sell warnings keep using p.target)
    const liveTarget = trimmedAtr > 0 ? calcEntryTargetStop(currentPrice, trimmedAtr, p.duration).target : null;
    p.liveTarget = liveTarget;

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

    const targetDriftPct = liveTarget ? ((liveTarget - p.target) / p.target) * 100 : 0;
    const targetDisplay = (liveTarget && Math.abs(targetDriftPct) > 5)
      ? `Original target: $${p.target.toFixed(2)} → Live target: $${liveTarget.toFixed(2)} <span class="pf-shifted">⚠ Shifted</span>`
      : `Target $${p.target.toFixed(2)}`;

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
  const targetDriftPct = (pos.liveTarget != null && pos.target)
    ? ((pos.liveTarget - pos.target) / pos.target) * 100
    : null;

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
    duration: pos.duration,
    priceRange: salePrice <= 3 ? '$1–$3' : salePrice <= 9 ? '$4–$9' : '$10–$20',
    sellWarningAtSale: currentWarn,
    targetDriftPct,
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
  const t2 = sold.filter(s=>s.volBuildNearMiss && s.volBuildNearMiss.consecutiveDays===2);
  const t2w = t2.filter(s=>s.pnlPct>0);
  const tr = sold.filter(s=>s.volBuildNearMiss && s.volBuildNearMiss.volRatio>=1.0 && s.volBuildNearMiss.volRatio<1.3);
  const trw = tr.filter(s=>s.pnlPct>0);
  return `  Trades where consecutive days was 2 (needed 3): ${t2.length} | win rate ${t2.length?((t2w.length/t2.length*100).toFixed(0)):'—'}%
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
  Volume spike:        0–30 pts (1.5x=10, 2x=20, 3x+=30)
  Volume build:        0–15 pts (3 consecutive days rising + today >=1.3x avg)
  Price momentum:      0–20 pts (2-4%=10, 4%+=20)
  RSI position:        0–20 pts (50-65=20, 65-75=10, <45 rising=15)
  Above 20-day MA:     10 pts
  Relative strength:   0–15 pts (outperform SPY by >0%=5, >1%=10, >2%=15)
  Consecutive up days: 0–15 pts (2 days=5, 3 days=10, 4+ days=15)
  Mean reversion:      0–20 pts (price 8-15% below MA, RSI<45, RSI turning up)

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
          <div class="settings-hint">BIOTECH ${STOCK_UNIVERSES.BIOTECH.length} · ENERGY ${STOCK_UNIVERSES.ENERGY.length} · TECH ${STOCK_UNIVERSES.TECH.length} · BROAD ${STOCK_UNIVERSES.BROAD.length}</div>
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
