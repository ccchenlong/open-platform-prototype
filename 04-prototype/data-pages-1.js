/* 数据分片 1 */
window.PAGES = (window.PAGES || []).concat([{
  id: "P00",
  name: "平台框架总览",
  group: "总览",
  kind: "overview",
  roles: ["分级管理员","应用管理员","工作台管理员","工单管理员"],
  fp: "整体框架",
  fpShort: "框架",
  desc: "开放平台整体原型框架：四层架构、信息架构、三条主流程、角色权限矩阵与公共规则。",
  meta: "194 功能点 / 11 模块 / 22 页",
  fname: "创新支撑系统 · 开放平台整体框架（门户配置 + 门户管理 + 前台浏览）",
  scene: "产品、研发、业务三方在进入逐页评审前，先对齐系统边界、页面全貌、角色分工与主流程；后续每页 PRD 与原型都以本页为基准，避免页面编号、角色与状态口径分叉。",
  rules: ["页面编号 P01–P22 唯一，PRD、原型、验收用例三处共用，不得私自定义（取自 project-spec.md）。","权限判定顺序固定为「角色 → 权限组 → 机构数据范围」，越权一律返回 403 态并留痕（R-01/R-02）。","后台配置与前台呈现为同源数据：后台保存后前台 ≤1 分钟生效，未配置的区块自动隐藏。","194 条功能点全部落在 P01–P18；前台浏览端 P19–P22 为 D-01 新增范围，独立验收、不计入 194 条。","每页必须具备正常、空、加载、错误、无权限五态，缺一不予验收。"],
  inputs: ["需求功能点清单（194 条，11 模块）与 N1/N2 已定稿结论。","角色定义：分级管理员、应用管理员、工作台管理员、工单管理员（D-02 超管仅判定）。","UI 规范：主色 #165DFF、卡片圆角 12px、字体 PingFang SC / Microsoft YaHei。"],
  outputs: ["整体框架页：四层架构、信息架构、三条主流程、权限矩阵、数据字典、非功能需求。","22 页可点击原型与逐页 PRD 面板（本页右侧可折叠）。","页面 → 功能点 → 规则编号的追溯关系。"],
  errors: ["角色未授权访问：展示 403 页与申请入口，不返回任何业务数据。","框架数据加载失败：整页错误态 + 重试，不使用缓存旧数据。","页面编号与 project-spec.md 不一致：构建期校验失败，阻断发布（build 号不变）。"],
  accept: ["22 页导航全部可打开，无 404、无空白页。","四类角色切换后，导航可见性与 403 拦截符合权限矩阵。","三条主流程（首页运营 / 能力发布 / 工单处理）在原型中可完整走通。","每页五态可切换且文案完整。","页面编号、字段名、状态名与 project-spec.md 抽查 3 处一致。"],
  mapping: [["arch","总体架构分层图","整体框架 / 四层职责"],["ia","信息架构四组 22 页","P01–P22 页面清单"],["flow","三条主流程泳道","验收主流程 A/B/C"],["matrix","角色 × 页面权限矩阵","R-01 / R-02 / 权限矩阵"],["dict","核心数据字典","字段字典（8 个对象）"],["nfr","非功能需求 N1–N6","性能 / 容量 / 安全 / 时效"]],
  extras: [{"title":"角色与数据范围","html":"<table><tr><th>角色</th><th>数据范围</th><th>核心页面</th></tr><tr><td>分级管理员</td><td>本级及下级机构</td><td>P01–P18（本级）</td></tr><tr><td>应用管理员</td><td>所辖应用</td><td>P05、P11–P13、P16</td></tr><tr><td>工作台管理员</td><td>本级工作台</td><td>P01–P09、P15、P18</td></tr><tr><td>工单管理员</td><td>本级工单</td><td>P14</td></tr></table>"},{"title":"页面清单（22 页）","html":"<table><tr><th>编号</th><th>页面</th><th>功能点</th></tr><tr><td>P01–P04</td><td>轮播图 / 公告 / 接入步骤 / 应用案例配置</td><td>26</td></tr><tr><td>P05–P08</td><td>开放能力 / 开发资源 / 开发指南 / 帮助中心首页配置</td><td>28</td></tr><tr><td>P09</td><td>指标展示</td><td>5</td></tr><tr><td>P10</td><td>接入步骤管理</td><td>6</td></tr><tr><td>P11–P13</td><td>开发资源 / 开发指南 / 开放能力管理</td><td>68</td></tr><tr><td>P14</td><td>我的工单</td><td>15</td></tr><tr><td>P15–P18</td><td>帮助 / 案例 / 公告 / 全局搜索管理</td><td>46</td></tr><tr><td>P19–P22</td><td>前台浏览端（D-01，不计入 194）</td><td>—</td></tr></table>"}],
  trace: "框架口径见 01-analysis.md 第 2/5 章、02-clarify.md C-01/C-03/C-07；页面编号见 project-spec.md 第 3 章。",
},
{
  id: "P01",
  name: "轮播图配置",
  group: "前台配置区",
  kind: "table",
  roles: ["分级管理员","工作台管理员"],
  fp: "7 条（F-001、F-029～F-034）",
  fpShort: "7",
  desc: "维护门户首页首屏轮播位：图片、标题、跳转链接、排序与启用状态，保存后前台即时生效。",
  meta: "覆盖角色：分级 / 工作台管理员",
  scene: "工作台管理员在重大活动或政策发布前，需要替换门户首屏轮播；运营人员不具备开发能力，要求在后台完成图片上传、排序与上下线，无需发版。",
  rules: ["标题必填且 ≤30 字；图片必填，格式 JPG/PNG，尺寸 1920×480，≤2MB。","跳转链接必填，仅允许 http/https 内链或站内路径；外链需勾选「外链」标记。","排序值 1–99，数字越小越靠前；拖拽与输入两种方式等效。","启用状态控制前台显隐：停用后前台立即移除，但记录保留（可再次启用）。","最多 8 条启用；超出时保存阻断并提示先停用其他轮播。"],
  inputs: ["标题、图片文件、跳转链接与链接类型、排序值。","启用状态、生效时间（可选，默认立即生效）。","查询条件：标题关键字、启用状态、更新时间区间。"],
  outputs: ["轮播图列表：缩略图、标题、跳转、排序、状态、更新时间。","新增 / 编辑侧边抽屉与保存结果提示。","前台首页轮播预览（含切换间隔）。"],
  errors: ["图片超限或格式不符：前端即时拦截，提示「图片需为 JPG/PNG，≤2MB」。","启用条数超 8 条：阻断保存并列出当前启用项。","删除被引用（首页配置固定项）：阻断并提示先解除引用。","列表加载失败：保留筛选条件，展示重试入口。"],
  accept: ["新增、编辑、删除、查看、查询、时间间隔修改 7 条功能点均可操作。","保存后前台首页轮播在 1 分钟内更新，排序与后台一致。","停用某条轮播后前台不再展示，重新启用后恢复原位置。","第 9 条启用被阻断，提示文案准确。","空态、加载、错误、无权限四态展示正确。"],
  mapping: [["filter","筛选区（标题 / 状态 / 时间）","F-033 轮播图查询"],["toolbar","工具栏（新增 / 批量删除 / 预览首页）","F-029 新增、F-031 删除"],["table","轮播图列表（缩略图、排序、状态）","F-001 配置管理、F-030 修改"],["row","行内操作（编辑 / 停用 / 删除）","F-030、F-031、F-034 时间间隔修改"],["pager","分页条","F-033 查询结果分页"],["note","生效说明","R-06 发布上线；排序值 1–99 升序（R-04）"]],
  filters: [{"label":"标题","ph":"请输入标题关键字"},{"label":"状态","type":"select","opts":["全部","已启用","已停用"]},{"label":"更新时间","ph":"2026-10-01 ~ 2026-10-29"}],
  actions: [{"label":"新增轮播图","primary":true},{"label":"批量删除","danger":true},{"label":"预览首页"}],
  columns: [{"k":"thumb","label":"缩略图","w":"80px","type":"thumb"},{"k":"title","label":"标题"},{"k":"link","label":"跳转链接"},{"k":"sort","label":"排序","w":"104px","type":"sort"},{"k":"status","label":"状态","w":"84px","type":"tag"},{"k":"time","label":"更新时间","w":"150px"},{"k":"ops","label":"操作","w":"150px","type":"ops"}],
  rows: [{"thumb":"轮播 1","title":"开放平台全新升级","link":"/portal/home","sort":1,"status":"已启用","tagCls":"green","time":"2026-10-28 16:20","ops":["编辑","停用","删除"]},{"thumb":"轮播 2","title":"数据共享服务上线","link":"/portal/data","sort":2,"status":"已启用","tagCls":"green","thumbCls":"alt","time":"2026-10-27 10:05","ops":["编辑","停用","删除"]},{"thumb":"轮播 3","title":"开发者接入指南","link":"https://open.jiangxi.gov.cn/guide","sort":3,"status":"已启用","tagCls":"green","thumbCls":"warn","time":"2026-10-25 09:12","ops":["编辑","停用","删除"]},{"thumb":"轮播 4","title":"国庆服务保障公告","link":"/portal/notice/1024","sort":4,"status":"已停用","tagCls":"gray","time":"2026-09-30 18:00","ops":["编辑","启用","删除"]}],
  total: 4,
  note: "<b>生效规则：</b>保存后写入配置中心并刷新 CDN，前台首页 ≤1 分钟生效；停用不删除记录，历史可追溯。",
  trace: "对应 03-prd.md 第 4 章 P01、第 5 章 R-04/R-06；功能点 F-001、F-029～F-034。",
  drawer: {
    add: {
          "okText": "确认新增",
          "fields": [
                {
                      "k": "title",
                      "label": "轮播标题",
                      "req": true,
                      "maxLen": 30,
                      "ph": "≤30 字"
                },
                {
                      "k": "image",
                      "label": "轮播图片",
                      "req": true,
                      "type": "select",
                      "opts": [
                            "banner-1.jpg",
                            "banner-2.jpg",
                            "banner-3.jpg",
                            "banner-4.jpg"
                      ],
                      "hint": "格式 JPG/PNG，尺寸 1920×480，≤2MB"
                },
                {
                      "k": "link",
                      "label": "跳转链接",
                      "req": true,
                      "ph": "/portal/home 或 https://..."
                },
                {
                      "k": "sort",
                      "label": "排序",
                      "kind": "number",
                      "value": "1",
                      "hint": "1–99，数字越小越靠前"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ],
                      "defaultIdx": 0
                }
          ]
    },
    edit: {
          "okText": "保存修改",
          "fields": [
                {
                      "k": "title",
                      "label": "轮播标题",
                      "req": true,
                      "maxLen": 30
                },
                {
                      "k": "image",
                      "label": "轮播图片",
                      "req": true,
                      "type": "select",
                      "opts": [
                            "banner-1.jpg",
                            "banner-2.jpg",
                            "banner-3.jpg"
                      ]
                },
                {
                      "k": "link",
                      "label": "跳转链接",
                      "req": true
                },
                {
                      "k": "sort",
                      "label": "排序",
                      "kind": "number"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ]
                }
          ]
    },
    view: {
          "okText": "关闭",
          "fields": [
                {
                      "k": "title",
                      "label": "轮播标题",
                      "req": true
                },
                {
                      "k": "image",
                      "label": "图片文件"
                },
                {
                      "k": "link",
                      "label": "跳转链接"
                },
                {
                      "k": "sort",
                      "label": "排序"
                },
                {
                      "k": "status",
                      "label": "状态"
                },
                {
                      "k": "time",
                      "label": "更新时间"
                }
          ]
    },
  },
  refs: [[],[],[],["P01 首页固定区块"]],
  validates: {
    add: function (v) {
      var errs = [];
      if ((v.sort | 0) < 1 || (v.sort | 0) > 99) errs.push('排序值须在 1–99 之间');
      var p = window.PAGES.find(function (x) { return x.id === 'P01'; });
      var enabled = (p.rows || []).filter(function (x) { return x.status === '已启用'; }).length;
      if (v.status === '已启用' && enabled >= 8) errs.push('已启用轮播已达 8 条上限（R-04）');
      return errs;
    },
    edit: function (v) {
      var errs = [];
      if ((v.sort | 0) < 1 || (v.sort | 0) > 99) errs.push('排序值须在 1–99 之间');
      return errs;
    }
  },
},
{
  id: "P02",
  name: "通知公告配置",
  group: "前台配置区",
  kind: "table",
  roles: ["分级管理员","工作台管理员"],
  fp: "7 条（F-002、F-035～F-040）",
  fpShort: "7",
  desc: "配置门户首页公告位：公告标题、摘要、有效期与置顶，内容来自「通知公告管理」已发布数据。",
  meta: "覆盖角色：分级 / 工作台管理员",
  scene: "工作台管理员需要在首页公告位展示最新政策与维护通知，公告正文由公告管理统一维护，首页只负责挑选与排序，避免同一内容维护两份。",
  rules: ["首页公告位只能从「已发布且未过期」的公告中选择，不允许在本页新建正文。","公告位最多展示 5 条；置顶公告最多 2 条，置顶按置顶时间倒序。","标题 ≤50 字；有效期起止必填，结束时间不得早于开始时间。","公告下线或过期后，首页位自动隐藏，不留空行。"],
  inputs: ["选择公告（弹窗按标题 / 分类 / 发布时间筛选）。","展示顺序、置顶标记、有效期起止。","查询条件：标题、发布状态、有效期。"],
  outputs: ["首页公告位配置列表：标题、来源公告、有效期、置顶、状态。","前台首页公告区效果预览。","保存结果与生效时间提示。"],
  errors: ["选择已下线公告：选项置灰并提示「该公告已下线」。","置顶超过 2 条：阻断并提示取消其他置顶。","有效期倒置：字段下方红字提示并阻断保存。","删除被首页引用：提示先在本页移除引用。"],
  accept: ["新增、修改、删除、查看、查询、置顶 7 条功能点可用。","只能选到已发布公告，下线公告不出现在候选项。","置顶顺序与前台展示顺序一致。","公告过期后首页不再展示，后台保留记录并标记「已过期」。"],
  mapping: [["filter","筛选区（标题 / 状态 / 有效期）","F-039 公告配置查询"],["toolbar","工具栏（选择公告 / 移除 / 预览）","F-035 新增、F-037 删除"],["table","公告位列表（来源、有效期、置顶）","F-002 配置管理、F-036 修改"],["row","行内操作（置顶 / 编辑 / 查看）","F-040 置顶、F-038 查看"],["pager","分页条","F-039 查询分页"]],
  filters: [{"label":"标题","ph":"请输入公告标题"},{"label":"状态","type":"select","opts":["全部","展示中","已过期","已移除"]}],
  actions: [{"label":"选择公告","primary":true},{"label":"批量移除","danger":true}],
  columns: [{"k":"title","label":"公告标题"},{"k":"src","label":"来源","w":"120px"},{"k":"range","label":"有效期","w":"210px"},{"k":"top","label":"置顶","w":"70px","type":"tag"},{"k":"status","label":"状态","w":"90px","type":"tag"},{"k":"ops","label":"操作","w":"150px","type":"ops"}],
  rows: [{"title":"关于开放平台 API 网关升级的通知","src":"公告管理","range":"2026-10-28 ~ 2026-11-10","top":"置顶","tagCls":"orange","status":"展示中","ops":["取消置顶","编辑","移除"]},{"title":"2026 年第三季度接口调用配额调整说明","src":"公告管理","range":"2026-10-20 ~ 2026-11-20","top":"置顶","tagCls":"orange","status":"展示中","ops":["取消置顶","编辑","移除"]},{"title":"开放能力目录新增 12 个服务端接口","src":"公告管理","range":"2026-10-15 ~ 2026-10-31","top":"—","tagCls":"gray","status":"展示中","ops":["置顶","编辑","移除"]},{"title":"国庆期间服务保障安排","src":"公告管理","range":"2026-09-28 ~ 2026-10-08","top":"—","tagCls":"gray","status":"已过期","ops":["编辑","移除"]}],
  total: 4,
  note: "<b>数据来源：</b>本页只做「挑选 + 排序 + 置顶」，公告正文在 P17 通知公告管理维护；公告下线条目在本页自动置灰。",
  trace: "对应 03-prd.md 第 4 章 P02；功能点 F-002、F-035～F-040；规则 R-04/R-06。",
  drawer: {
    add: {
          "okText": "确认新增",
          "fields": [
                {
                      "k": "title",
                      "label": "公告标题",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "src",
                      "label": "来源",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "range",
                      "label": "有效期",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "top",
                      "label": "置顶",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ],
                      "defaultIdx": 0
                }
          ]
    },
    edit: {
          "okText": "保存修改",
          "fields": [
                {
                      "k": "title",
                      "label": "公告标题",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "src",
                      "label": "来源",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "range",
                      "label": "有效期",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "top",
                      "label": "置顶",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ],
                      "defaultIdx": 0
                }
          ]
    },
    view: {
          "okText": "关闭",
          "fields": [
                {
                      "k": "title",
                      "label": "公告标题"
                },
                {
                      "k": "src",
                      "label": "来源"
                },
                {
                      "k": "range",
                      "label": "有效期"
                },
                {
                      "k": "top",
                      "label": "置顶"
                },
                {
                      "k": "status",
                      "label": "状态"
                },
                {
                      "k": "ops",
                      "label": "操作"
                }
          ]
    },
  },
  refs: [[],[],[],[]],
  validates: { add: function(){ return []; }, edit: function(){ return []; } },
},
{
  id: "P03",
  name: "接入步骤配置",
  group: "前台配置区",
  kind: "table",
  roles: ["分级管理员","工作台管理员"],
  fp: "6 条（F-003、F-041～F-045）",
  fpShort: "6",
  desc: "配置门户首页「如何接入」步骤条：步骤序号、标题、说明与图标，支持上下调序。",
  meta: "覆盖角色：分级 / 工作台管理员",
  scene: "新政策上线后接入流程有变化，运营人员需要调整首页三步指引的文案与顺序，让开发者按最新流程申请能力，而不需要研发改页面。",
  rules: ["步骤数量 3–6 条，序号唯一且连续，不允许跳号。","标题 ≤20 字，说明 ≤80 字，图标从内置图标库选择。","上移 / 下移即时调整序号，首条不可上移、末条不可下移。","删除步骤后自动重排序号，无需手工维护。"],
  inputs: ["步骤序号、标题、说明、图标。","步骤排序操作（上移 / 下移 / 拖拽）。","查询条件：步骤标题关键字。"],
  outputs: ["步骤列表（按序号升序）。","前台首页步骤条预览。","保存结果提示。"],
  errors: ["步骤少于 3 条：阻断保存并提示最少 3 条。","标题/说明超长：输入框实时计数并标红。","并发调序冲突：提示「排序已被他人修改，请刷新」。","加载失败：保留列表骨架并给重试。"],
  accept: ["新增、修改、删除、查看、查询 6 条功能点可用。","调序后前台步骤顺序同步，序号连续。","步骤数少于 3 或多于 6 时保存被阻断。","删除中间步骤后，剩余步骤序号自动连续。"],
  mapping: [["filter","筛选区（步骤标题）","F-045 接入步骤查询"],["toolbar","工具栏（新增步骤）","F-041 新增"],["table","步骤列表（序号 / 标题 / 说明）","F-003 配置管理、F-042 修改"],["row","行内操作（上移 / 下移 / 删除）","F-043 删除、排序"],["pager","分页条","F-045 查询结果"]],
  filters: [{"label":"步骤标题","ph":"请输入标题关键字"}],
  actions: [{"label":"新增步骤","primary":true},{"label":"预览首页"}],
  columns: [{"k":"sort","label":"序号","w":"104px","type":"sort"},{"k":"title","label":"步骤标题","w":"200px"},{"k":"desc","label":"说明"},{"k":"icon","label":"图标","w":"90px"},{"k":"time","label":"更新时间","w":"150px"},{"k":"ops","label":"操作","w":"170px","type":"ops"}],
  rows: [{"sort":1,"title":"注册开发者账号","desc":"完成实名认证并创建应用，获取 AppKey","icon":"user","time":"2026-10-26 11:30","ops":["下移","编辑","删除"]},{"sort":2,"title":"申请开放能力","desc":"按目录选择 API，提交申请并等待审批","icon":"api","time":"2026-10-26 11:32","ops":["上移","下移","删除"]},{"sort":3,"title":"联调与上线","desc":"按文档联调，通过测试后发布上线","icon":"rocket","time":"2026-10-26 11:35","ops":["上移","编辑","删除"]}],
  total: 3,
  note: "<b>规则：</b>步骤数 3–6 条；删除后自动补位重排；首页按序号升序展示，未配置时首页该区块隐藏。",
  trace: "对应 03-prd.md 第 4 章 P03；功能点 F-003、F-041～F-045。",
  drawer: {
    add: {
          "okText": "确认新增",
          "fields": [
                {
                      "k": "title",
                      "label": "步骤标题",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "desc",
                      "label": "说明",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "icon",
                      "label": "图标",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "time",
                      "label": "更新时间",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ],
                      "defaultIdx": 0
                }
          ]
    },
    edit: {
          "okText": "保存修改",
          "fields": [
                {
                      "k": "title",
                      "label": "步骤标题",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "desc",
                      "label": "说明",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "icon",
                      "label": "图标",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "time",
                      "label": "更新时间",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ],
                      "defaultIdx": 0
                }
          ]
    },
    view: {
          "okText": "关闭",
          "fields": [
                {
                      "k": "sort",
                      "label": "序号"
                },
                {
                      "k": "title",
                      "label": "步骤标题"
                },
                {
                      "k": "desc",
                      "label": "说明"
                },
                {
                      "k": "icon",
                      "label": "图标"
                },
                {
                      "k": "time",
                      "label": "更新时间"
                },
                {
                      "k": "ops",
                      "label": "操作"
                }
          ]
    },
  },
  refs: [[],[],[]],
  validates: { add: function(){ return []; }, edit: function(){ return []; } },
},
{
  id: "P04",
  name: "应用案例配置",
  group: "前台配置区",
  kind: "table",
  roles: ["分级管理员","工作台管理员"],
  fp: "6 条（F-004、F-046～F-050）",
  fpShort: "6",
  desc: "配置首页案例位：从案例库挑选优质案例，设置展示顺序与置顶。",
  meta: "覆盖角色：分级 / 工作台管理员",
  scene: "首页需要展示有代表性的应用案例以增强可信度；运营希望每季度替换案例组合，只调整首页展示，不改动案例库内容。",
  rules: ["只能选择「已上架」案例；已下架案例不可选，已选项显示「已下架」并允许移除。","首页案例最多 6 条，置顶最多 1 条。","同一案例不可重复添加。","首页顺序与案例库排序解耦，本页顺序优先。"],
  inputs: ["案例选择（按行业 / 服务商筛选）。","展示顺序、置顶标记。","查询条件：案例名称、状态。"],
  outputs: ["首页案例位列表：封面、案例名称、服务商、顺序、状态。","前台首页案例区预览。","保存结果提示。"],
  errors: ["重复添加同一案例：阻断并提示「该案例已在首页」。","选择已下架案例：选项置灰并给出原因。","超过 6 条：阻断并提示上限。","封面缺失：前台使用默认占位图，后台标记「封面缺失」提醒补全。"],
  accept: ["增加、删除、查看、查询、置顶 6 条功能点可用。","首页仅展示已上架案例，下架后 1 分钟内从前台移除。","顺序调整后前台卡片顺序一致。","重复添加被阻断。"],
  mapping: [["filter","筛选区（案例名称 / 状态）","F-049 案例配置查询"],["toolbar","工具栏（添加案例 / 批量移除）","F-046 增加、F-047 删除"],["table","首页案例位列表","F-004 配置管理"],["row","行内操作（置顶 / 查看 / 移除）","F-050 置顶、F-048 查看"],["pager","分页条","F-049 查询结果"]],
  filters: [{"label":"案例名称","ph":"请输入案例名称"},{"label":"状态","type":"select","opts":["全部","展示中","已下架"]}],
  actions: [{"label":"添加案例","primary":true},{"label":"批量移除","danger":true}],
  columns: [{"k":"cover","label":"封面","w":"80px","type":"thumb"},{"k":"name","label":"案例名称"},{"k":"provider","label":"服务商","w":"150px"},{"k":"top","label":"置顶","w":"70px","type":"tag"},{"k":"status","label":"状态","w":"90px","type":"tag"},{"k":"ops","label":"操作","w":"140px","type":"ops"}],
  rows: [{"cover":"案例 1","name":"赣服通 · 一网通办","provider":"云上江西","top":"置顶","tagCls":"orange","status":"展示中","ops":["取消置顶","查看","移除"]},{"cover":"案例 2","name":"智慧社区 · 门禁通行","provider":"江西移动","top":"—","tagCls":"gray","status":"展示中","thumbCls":"alt","ops":["置顶","查看","移除"]},{"cover":"案例 3","name":"政务云 · 数据治理","provider":"江西电信","top":"—","tagCls":"gray","status":"展示中","thumbCls":"warn","ops":["置顶","查看","移除"]}],
  total: 3,
  note: "<b>联动：</b>案例内容在 P16 应用案例管理维护；本页只维护首页展示集合与顺序，案例下架后此处自动标灰。",
  trace: "对应 03-prd.md 第 4 章 P04；功能点 F-004、F-046～F-050；规则 R-04。",
  drawer: {
    add: {
          "okText": "确认新增",
          "fields": [
                {
                      "k": "cover",
                      "label": "封面",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "name",
                      "label": "案例名称",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "provider",
                      "label": "服务商",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "top",
                      "label": "置顶",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ],
                      "defaultIdx": 0
                }
          ]
    },
    edit: {
          "okText": "保存修改",
          "fields": [
                {
                      "k": "cover",
                      "label": "封面",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "name",
                      "label": "案例名称",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "provider",
                      "label": "服务商",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "top",
                      "label": "置顶",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "req": false,
                      "type": "select",
                      "hint": "默认"
                },
                {
                      "k": "status",
                      "label": "状态",
                      "type": "select",
                      "opts": [
                            "已启用",
                            "已停用"
                      ],
                      "defaultIdx": 0
                }
          ]
    },
    view: {
          "okText": "关闭",
          "fields": [
                {
                      "k": "cover",
                      "label": "封面"
                },
                {
                      "k": "name",
                      "label": "案例名称"
                },
                {
                      "k": "provider",
                      "label": "服务商"
                },
                {
                      "k": "top",
                      "label": "置顶"
                },
                {
                      "k": "status",
                      "label": "状态"
                },
                {
                      "k": "ops",
                      "label": "操作"
                }
          ]
    },
  },
  refs: [[],[],[]],
  validates: { add: function(){ return []; }, edit: function(){ return []; } },
}
]);
