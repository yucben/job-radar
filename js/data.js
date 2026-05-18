// JobRadar 公司数据
// 聚焦"隐形好公司"——有融资、有壁垒、但不一定知名

const COMPANIES = [
  // ===== 前沿技术 =====
  {
    id: 1,
    name: "月之暗面 (Moonshot AI)",
    industry: "前沿技术",
    funding: "B轮",
    year: 2023,
    advantage: ["独角兽"],
    location: "北京市",
    media: true,
    hiring: true,
    desc: "杨植麟创立的大模型公司，Kimi Chat 爆火，阿里/红杉重注。AGI 赛道最受瞩目的创业公司之一，技术氛围极强。",
    fundingAmt: "超10亿美元",
    investors: "阿里巴巴、红杉中国、砺思资本",
    employees: "300-500人",
    website: "https://www.moonshot.cn",
    jobs: [
      { title: "大模型算法工程师", salary: "50-100K", exp: "3-5年" },
      { title: "后端开发工程师", salary: "35-60K", exp: "3-5年" },
      { title: "产品经理 (AI方向)", salary: "30-50K", exp: "3-5年" }
    ]
  },
  {
    id: 2,
    name: "智谱AI (Zhipu AI)",
    industry: "前沿技术",
    funding: "C轮",
    year: 2019,
    advantage: ["独角兽", "高新技术企业"],
    location: "北京市",
    media: true,
    hiring: true,
    desc: "清华系大模型公司，GLM 系列模型，B端落地扎实。已获北京市人工智能产业投资基金等国资支持，商业化路径清晰。",
    fundingAmt: "超25亿人民币",
    investors: "君联资本、启明创投、北京市AI产业基金",
    employees: "1000+",
    website: "https://www.zhipuai.cn",
    jobs: [
      { title: "NLP算法研究员", salary: "40-80K", exp: "1-3年" },
      { title: "前端开发工程师", salary: "25-45K", exp: "1-3年" },
      { title: "AI应用开发工程师", salary: "30-55K", exp: "2-5年" }
    ]
  },

  // ===== 企业服务 =====
  {
    id: 3,
    name: "蓝湖 (Lanhu)",
    industry: "企业服务",
    funding: "C轮",
    year: 2017,
    advantage: ["瞪羚企业", "高新技术企业"],
    location: "北京市",
    media: true,
    hiring: true,
    desc: "产品设计协作平台，已服务超百万设计师和产品经理。从设计稿到代码一站式协作，在国内设计工具赛道稳居头部。",
    fundingAmt: "10亿+人民币",
    investors: "GGV纪源资本、红杉中国、金沙江创投",
    employees: "500-800人",
    website: "https://lanhuapp.com",
    jobs: [
      { title: "前端架构师", salary: "40-60K", exp: "5-10年" },
      { title: "产品经理", salary: "28-45K", exp: "3-5年" },
      { title: "后端开发 (Go)", salary: "30-50K", exp: "2-5年" }
    ]
  },
  {
    id: 4,
    name: "ShowMeBug",
    industry: "企业服务",
    funding: "A+轮",
    year: 2019,
    advantage: ["高新技术企业"],
    location: "广东省",
    media: false,
    hiring: true,
    desc: "技术人才评估平台，用实战编程替代传统笔面试。已服务字节、腾讯等数千家企业，技术面试 SaaS 赛道头部玩家。",
    fundingAmt: "近亿元人民币",
    investors: "红杉中国、高瓴创投",
    employees: "100-200人",
    website: "https://www.showmebug.com",
    jobs: [
      { title: "全栈工程师", salary: "25-40K", exp: "3-5年" },
      { title: "技术销售", salary: "20-35K", exp: "2-5年" },
      { title: "测试开发", salary: "20-35K", exp: "2-5年" }
    ]
  },

  // ===== 医疗健康 =====
  {
    id: 5,
    name: "深睿医疗 (DeepWise)",
    industry: "医疗健康",
    funding: "C+轮",
    year: 2017,
    advantage: ["专精特新", "高新技术企业"],
    location: "北京市",
    media: true,
    hiring: true,
    desc: "AI 医疗影像诊断平台，覆盖肺部、乳腺、脑卒中等多部位。已有 NMPA 三类证，产品落地数百家医院。",
    fundingAmt: "数亿元人民币",
    investors: "君联资本、联想之星、丹华资本",
    employees: "300-500人",
    website: "https://www.deepwise.com",
    jobs: [
      { title: "医学图像算法工程师", salary: "35-60K", exp: "2-5年" },
      { title: "Java后端开发", salary: "25-40K", exp: "3-5年" },
      { title: "临床产品经理", salary: "25-40K", exp: "3-5年" }
    ]
  },

  // ===== 消费电商 =====
  {
    id: 6,
    name: "远方好物",
    industry: "消费电商",
    funding: "A轮",
    year: 2021,
    advantage: ["创新型中小企业"],
    location: "浙江省",
    media: false,
    hiring: true,
    desc: "优质食品私域电商平台，主打溯源+高品质食品。社交电商新锐，月GMV破亿，团队小而精悍。",
    fundingAmt: "千万级人民币",
    investors: "顺为资本、真格基金",
    employees: "50-100人",
    website: "https://www.yuanfang.com",
    jobs: [
      { title: "运营总监", salary: "25-40K", exp: "5-10年" },
      { title: "前端开发", salary: "18-30K", exp: "1-3年" },
      { title: "内容运营", salary: "12-20K", exp: "1-3年" }
    ]
  },

  // ===== 先进制造 =====
  {
    id: 7,
    name: "梅卡曼德 (Mech-Mind)",
    industry: "先进制造",
    funding: "C+轮",
    year: 2016,
    advantage: ["专精特新小巨人", "独角兽", "高新技术企业"],
    location: "北京市",
    media: true,
    hiring: true,
    desc: "工业机器人 3D 视觉引导，已落地汽车、物流、家电等场景。全球领先的 AI+工业机器人公司，出海进展快。",
    fundingAmt: "超15亿人民币",
    investors: "美团、IDG资本、红杉中国",
    employees: "500-800人",
    website: "https://www.mech-mind.com",
    jobs: [
      { title: "3D视觉算法工程师", salary: "40-70K", exp: "2-5年" },
      { title: "ROS开发工程师", salary: "30-50K", exp: "2-5年" },
      { title: "海外销售经理", salary: "25-45K", exp: "3-5年" }
    ]
  },

  // ===== 教育 =====
  {
    id: 8,
    name: "小鹅通",
    industry: "教育",
    funding: "B轮",
    year: 2016,
    advantage: ["高新技术企业", "瞪羚企业"],
    location: "广东省",
    media: false,
    hiring: true,
    desc: "知识产品与用户服务 SaaS，服务数百万知识创作者。从知识付费到企业培训，品牌认知度高，盈利稳定。",
    fundingAmt: "数亿元人民币",
    investors: "腾讯、IDG资本",
    employees: "500-1000人",
    website: "https://www.xiaoe-tech.com",
    jobs: [
      { title: "高级Java开发", salary: "30-45K", exp: "5-10年" },
      { title: "前端开发", salary: "22-38K", exp: "3-5年" },
      { title: "客户成功经理", salary: "18-28K", exp: "2-5年" }
    ]
  },

  // ===== 跨境出海 =====
  {
    id: 9,
    name: "店匠科技 (Shoplazza)",
    industry: "跨境出海",
    funding: "C轮",
    year: 2017,
    advantage: ["高新技术企业", "瞪羚企业"],
    location: "广东省",
    media: true,
    hiring: true,
    desc: "跨境电商独立站 SaaS，服务全球超 30 万商家。对标 Shopify，专注品牌出海，海外市场增速迅猛。",
    fundingAmt: "超1.5亿美元",
    investors: "软银愿景基金、红杉中国、前海母基金",
    employees: "500-1000人",
    website: "https://www.shoplazza.com",
    jobs: [
      { title: "前端架构师 (React)", salary: "35-55K", exp: "5-10年" },
      { title: "后端开发 (Node.js/Go)", salary: "28-45K", exp: "3-5年" },
      { title: "SEO/增长运营", salary: "20-35K", exp: "3-5年" }
    ]
  },

  // ===== 体育游戏 =====
  {
    id: 10,
    name: "鹰角网络 (Hypergryph)",
    industry: "体育游戏",
    funding: "战略融资",
    year: 2017,
    advantage: ["独角兽"],
    location: "上海市",
    media: true,
    hiring: true,
    desc: "明日方舟开发商，二次元游戏 Top 级厂商。单款产品年流水数十亿，研发实力强，新作备受期待。",
    fundingAmt: "未披露",
    investors: "腾讯、B站",
    employees: "500-1000人",
    website: "https://www.hypergryph.com",
    jobs: [
      { title: "游戏服务器开发", salary: "30-50K", exp: "3-5年" },
      { title: "Unity客户端开发", salary: "28-48K", exp: "3-5年" },
      { title: "技术美术 (TA)", salary: "30-55K", exp: "3-5年" }
    ]
  },

  // ===== 智能硬件 =====
  {
    id: 11,
    name: "追觅科技 (Dreame)",
    industry: "智能硬件",
    funding: "C+轮",
    year: 2017,
    advantage: ["独角兽", "高新技术企业"],
    location: "江苏省",
    media: true,
    hiring: true,
    desc: "智能清洁家电，扫地机器人/洗地机/吸尘器。全球出货量快速增长，技术与性价比双领先，海外市场爆发。",
    fundingAmt: "超36亿人民币",
    investors: "华兴新经济基金、CPE源峰、碧桂园创投",
    employees: "2000+",
    website: "https://www.dreame.com",
    jobs: [
      { title: "嵌入式开发工程师", salary: "28-45K", exp: "3-5年" },
      { title: "SLAM算法工程师", salary: "35-60K", exp: "2-5年" },
      { title: "海外电商运营", salary: "20-35K", exp: "2-5年" }
    ]
  },

  // ===== 金融 =====
  {
    id: 12,
    name: "XTransfer",
    industry: "金融",
    funding: "D轮",
    year: 2017,
    advantage: ["独角兽", "高新技术企业"],
    location: "上海市",
    media: true,
    hiring: true,
    desc: "一站式外贸企业跨境金融和风控服务，帮助中小外贸企业解决收款难题。已服务超 30 万家外贸企业。",
    fundingAmt: "超3亿美元",
    investors: "D1 Capital Partners、Telstra Ventures、招商局创投",
    employees: "1000-2000人",
    website: "https://www.xtransfer.com",
    jobs: [
      { title: "Java架构师", salary: "40-65K", exp: "5-10年" },
      { title: "风控算法工程师", salary: "35-55K", exp: "3-5年" },
      { title: "前端开发", salary: "25-42K", exp: "3-5年" }
    ]
  },

  // ===== 本地生活 =====
  {
    id: 13,
    name: "锅圈食汇",
    industry: "本地生活",
    funding: "D+轮",
    year: 2017,
    advantage: ["独角兽"],
    location: "上海市",
    media: true,
    hiring: true,
    desc: "火锅烧烤食材超市，全国门店超万。从供应链到终端门店全链路打通，下沉市场扩张迅猛。",
    fundingAmt: "超30亿人民币",
    investors: "IDG资本、招银国际、茅台基金",
    employees: "3000+",
    website: "https://www.guoquan.com",
    jobs: [
      { title: "供应链产品经理", salary: "25-40K", exp: "3-5年" },
      { title: "数据开发工程师", salary: "28-45K", exp: "3-5年" },
      { title: "区域运营经理", salary: "20-35K", exp: "3-5年" }
    ]
  },

  // ===== 汽车出行 =====
  {
    id: 14,
    name: "禾赛科技 (Hesai)",
    industry: "汽车出行",
    funding: "已上市",
    year: 2014,
    advantage: ["高新技术企业"],
    location: "上海市",
    media: true,
    hiring: true,
    desc: "全球领先的激光雷达制造商，已在美国纳斯达克上市。理想、小米、美团等头部客户，自动驾驶核心供应商。",
    fundingAmt: "IPO 融资1.9亿美元",
    investors: "百度、小米、博世、美团",
    employees: "1000+",
    website: "https://www.hesaitech.com",
    jobs: [
      { title: "光学工程师", salary: "30-50K", exp: "3-5年" },
      { title: "嵌入式软件工程师", salary: "28-48K", exp: "3-5年" },
      { title: "FPGA开发工程师", salary: "35-55K", exp: "3-5年" }
    ]
  },

  // ===== 通信/半导体 =====
  {
    id: 15,
    name: "此芯科技 (Cix Technology)",
    industry: "通信/半导体",
    funding: "B+轮",
    year: 2021,
    advantage: ["专精特新", "高新技术企业"],
    location: "上海市",
    media: false,
    hiring: true,
    desc: "ARM 架构高性能 CPU 芯片设计公司。团队来自 AMD/苹果/高通，专注 PC/服务器 CPU，国产替代明星。",
    fundingAmt: "数亿元人民币",
    investors: "联想创投、蔚来资本、启明创投",
    employees: "200-500人",
    website: "https://www.cixtech.com",
    jobs: [
      { title: "SoC设计工程师", salary: "40-70K", exp: "3-5年" },
      { title: "芯片验证工程师", salary: "35-60K", exp: "3-5年" },
      { title: "Linux内核工程师", salary: "30-50K", exp: "3-5年" }
    ]
  },

  // ===== 工具软件 =====
  {
    id: 16,
    name: "白描 (Baimiao)",
    industry: "工具软件",
    funding: "未融资",
    year: 2018,
    advantage: [],
    location: "北京市",
    media: false,
    hiring: false,
    desc: "高精度 OCR 文字识别工具，个人开发者作品。App Store 效率榜常年前列，小而美的标杆产品。",
    fundingAmt: "未融资",
    investors: "个人独立开发",
    employees: "1-5人",
    website: "https://baimiaoapp.com",
    jobs: []
  },

  // ===== 能源环保 =====
  {
    id: 17,
    name: "正泰新能 (Astronergy)",
    industry: "能源环保",
    funding: "已上市",
    year: 2006,
    advantage: ["高新技术企业"],
    location: "浙江省",
    media: true,
    hiring: true,
    desc: "正泰集团旗下光伏制造，全球光伏组件出货量 Top 10。从硅片到组件全产业链布局，海外市场增长强劲。",
    fundingAmt: "上市公司",
    investors: "正泰集团",
    employees: "10000+",
    website: "https://www.astronergy.com",
    jobs: [
      { title: "工艺工程师", salary: "15-25K", exp: "1-3年" },
      { title: "海外销售经理", salary: "20-35K", exp: "3-5年" },
      { title: "设备工程师", salary: "12-22K", exp: "1-3年" }
    ]
  },

  // ===== 社交网络 =====
  {
    id: 18,
    name: "Soul App",
    industry: "社交网络",
    funding: "D轮",
    year: 2016,
    advantage: ["独角兽"],
    location: "上海市",
    media: true,
    hiring: true,
    desc: "新一代社交平台，基于兴趣图谱和 AI 匹配。年轻用户占比极高，已提交港交所上市申请。",
    fundingAmt: "超2亿美元",
    investors: "腾讯、米哈游、元生资本",
    employees: "1000-2000人",
    website: "https://www.soulapp.cn",
    jobs: [
      { title: "推荐算法工程师", salary: "35-60K", exp: "3-5年" },
      { title: "Android开发", salary: "28-48K", exp: "3-5年" },
      { title: "数据分析师", salary: "20-38K", exp: "2-5年" }
    ]
  },

  // ===== 物联网/硬件 =====
  {
    id: 19,
    name: "涂鸦智能 (Tuya)",
    industry: "物联网/硬件",
    funding: "已上市",
    year: 2014,
    advantage: ["高新技术企业"],
    location: "浙江省",
    media: true,
    hiring: true,
    desc: "全球化 IoT 云平台，已在美国纽交所上市。连接全球超 200 个国家和地区，AI+IoT 开发者生态庞大。",
    fundingAmt: "纽交所上市",
    investors: "NEA、腾讯",
    employees: "3000+",
    website: "https://www.tuya.com",
    jobs: [
      { title: "嵌入式开发", salary: "25-42K", exp: "3-5年" },
      { title: "Java后端架构师", salary: "35-55K", exp: "5-10年" },
      { title: "海外产品经理", salary: "25-40K", exp: "3-5年" }
    ]
  },

  // ===== 物流 =====
  {
    id: 20,
    name: "箱信科技",
    industry: "物流",
    funding: "A+轮",
    year: 2019,
    advantage: ["创新型中小企业"],
    location: "天津市",
    media: false,
    hiring: false,
    desc: "集装箱运输智能调度平台。用算法匹配货主与货车，提升集装箱运输效率。港口物流数字化新锐。",
    fundingAmt: "千万级人民币",
    investors: "真格基金、源码资本",
    employees: "50-150人",
    website: "https://www.xiangxin.tech",
    jobs: [
      { title: "Java后端开发", salary: "18-30K", exp: "2-5年" },
      { title: "算法工程师", salary: "25-40K", exp: "2-5年" }
    ]
  }
];

// Filter option definitions
const FILTERS = {
  industry: ["不限","文化娱乐","消费电商","汽车出行","教育","金融","企业服务","产业升级","前沿技术","医疗健康","先进制造","通信/半导体","物联网/硬件","工具软件","社交网络","农林牧渔","能源环保","本地生活","体育游戏","跨境出海","房产地产","旅游","广告营销","智能硬件","物流","区块链","传统制造","元宇宙","其他"],
  funding: ["不限","未融资","种子轮","天使轮","Pre-A轮","A轮","A+轮","Pre-B轮","B轮","B+轮","C轮","C+轮","D轮","D+轮","E轮","F轮","G轮","H轮","股权融资","战略融资","定向增发","Pre-IPO","基石轮","已上市","IPO","新三板","已退市/私有化","并购/合并","其他"],
  year: ["不限","2026年","2025年","2024年","2023年","2022年","2021年","2020年","2019年","2018年","2017年","2016年","2015年","2014年","2013年","2012年","2011年","2010年及以前"],
  advantage: ["不限","专精特新小巨人","专精特新","创新型中小企业","高新技术企业","科技型中小企业","独角兽","瞪羚企业","雏鹰企业"],
  location: ["不限","中国","海外","福建省","广东省","北京市","香港特别行政区","吉林省","天津市","辽宁省","上海市","河北省","江苏省","内蒙古自治区","台湾省","贵州省","宁夏回族自治区","浙江省","安徽省","山东省","黑龙江省","山西省","陕西省","广西壮族自治区","河南省","重庆市","四川省","云南省","澳门特别行政区","湖北省","西藏自治区","甘肃省","海南省","新疆维吾尔自治区","青海省","湖南省","江西省"],
  media: ["不限","是","否"],
  hiring: ["不限","是","否"]
};
