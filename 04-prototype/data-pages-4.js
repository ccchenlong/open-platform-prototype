/* 数据分片 4 */
window.PAGES = (window.PAGES || []).concat([{
  id: "P14",
  name: "我的工单",
  group: "后台管理区",
  kind: "table",
  roles: ["分级管理员","工单管理员"],
  fp: "15 条（F-020～F-022、F-143～F-154）",
  fpShort: "15",
  desc: "工单的处理与审批：待处理 → 处理中 → 待审批 → 已完成 / 已驳回，全链路留痕。",
  meta: "覆盖角色：分级 / 工单管理员",
  scene: "外部用户在门户提交接入咨询后，工单管理员在本页接单处理；处理结果需经另一人审批，避免自审自批；超时工单标红预警。",
  rules: ["状态机：待处理 → 处理中 → 待审批 → 已完成 / 已驳回；驳回后可重新提交（R-07）。","审批人不可与处理人同一人（R-08）。","SLA：普通工单 24 小时、紧急工单 4 小时；超时未处理标红并在列表置顶。","工单完成前必须填写处理结论与附件（可选）。","本页不做工单填报（D-03），填报由外部用户在门户完成。","导出单次 ≤1 万条，超量请缩小范围。"],
  inputs: ["工单编号、标题、提交人、类型、优先级、提交时间。","处理结论、处理附件、审批意见。","查询条件：状态、优先级、提交时间、关键词。"],
  outputs: ["工单列表（状态、SLA 剩余时长、当前处理人）。","工单详情与流转记录（每次操作留痕）。","处理/审批结果通知、导出文件。"],
  errors: ["非法流转：阻断并提示当前状态不可执行该操作。","审批人与处理人相同：阻断并提示更换审批人。","SLA 超时：列表标红，不影响操作。","导出超量：提示缩小筛选范围。"],
  accept: ["待处理、处理中、待审批、已完成各状态筛选正确。","提交 → 处理 → 审批 → 完成全链路可走通且留痕。","同人审批被阻断；驳回后可重新提交。","超时工单标红并排在前列。","导出 1 万条以内成功，超量被阻断。"],
  mapping: [["tabs","状态页签（待处理 / 处理中 / 待审批 / 已完成）","F-149 待处理查询、F-148 查询"],["filter","筛选区（优先级 / 时间 / 关键词）","F-146 排序、F-148 查询"],["toolbar","工具栏（导出 / 批量认领）","F-143 新增（外部）、导出"],["table","工单列表（状态 / SLA / 处理人）","F-020 填报（外部）、F-021 处理"],["row","行内操作（处理 / 审批 / 查看）","F-022 审批、F-153 审批通过、F-154 审批退回"],["note","状态机与评价","R-07、R-08、F-150～F-152"]],
  tabs: ["待处理","处理中","待审批","已完成"],
  filters: [{"label":"优先级","type":"select","opts":["全部","紧急","普通"]},{"label":"提交时间","ph":"2026-10-01 ~ 2026-10-29"},{"label":"关键词","ph":"工单编号 / 标题 / 提交人"}],
  actions: [{"label":"批量认领","primary":true},{"label":"导出工单"}],
  columns: [{"k":"no","label":"工单编号","w":"130px"},{"k":"title","label":"标题"},{"k":"user","label":"提交人","w":"110px"},{"k":"status","label":"状态","w":"96px","type":"tag"},{"k":"sla","label":"SLA 剩余","w":"110px"},{"k":"owner","label":"当前处理人","w":"110px"},{"k":"ops","label":"操作","w":"150px","type":"ops"}],
  rows: [{"no":"T-20261028-0012","title":"统一身份认证接口返回 401","user":"赣服通","status":"待处理","tagCls":"red","sla":"3 小时 12 分","owner":"—","ops":["认领","查看"]},{"no":"T-20261028-0011","title":"申请提高 API 调用配额","user":"智慧社区","status":"处理中","tagCls":"blue","sla":"18 小时","owner":"王工","ops":["处理","查看"]},{"no":"T-20261027-0008","title":"电子证照核验结果为空","user":"政务云","status":"待审批","tagCls":"orange","sla":"已处理","owner":"李工","ops":["审批","查看"]},{"no":"T-20261026-0003","title":"开发者账号实名认证失败","user":"个人开发者","status":"已完成","tagCls":"green","sla":"已完成","owner":"王工","ops":["查看","评价"]}],
  total: 4,
  note: "<b>状态机：</b>待处理 → 处理中 → 待审批 → 已完成 / 已驳回（驳回可重提）。<div class=\"steps-h\" style=\"margin-top:10px\"><div class=\"stepdot done\">提交</div><div class=\"stepdot on\">处理</div><div class=\"stepdot\">审批</div><div class=\"stepdot\">完成</div></div><b>约束：</b>审批人 ≠ 处理人（R-08）；超时标红；导出 ≤1 万条。",
  trace: "对应 03-prd.md 第 4 章 P14；功能点 F-020～F-022、F-143～F-154；规则 R-07/R-08。",
  drawer: {
    add: {
          "okText": "确认新增",
          "fields": [
                {
                      "k": "no",
                      "label": "工单编号",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "title",
                      "label": "标题",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "user",
                      "label": "提交人",
                      "req": false,
                      "type": "text",
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
                      "k": "sla",
                      "label": "SLA 剩余",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "owner",
                      "label": "当前处理人",
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
                      "k": "no",
                      "label": "工单编号",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "title",
                      "label": "标题",
                      "req": true,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "user",
                      "label": "提交人",
                      "req": false,
                      "type": "text",
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
                      "k": "sla",
                      "label": "SLA 剩余",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "owner",
                      "label": "当前处理人",
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
                      "k": "no",
                      "label": "工单编号"
                },
                {
                      "k": "title",
                      "label": "标题"
                },
                {
                      "k": "user",
                      "label": "提交人"
                },
                {
                      "k": "status",
                      "label": "状态"
                },
                {
                      "k": "sla",
                      "label": "SLA 剩余"
                },
                {
                      "k": "owner",
                      "label": "当前处理人"
                }
          ]
    },
    handle: { okText: '提交处理', fields: [
      { k: 'conclusion', label: '处理结论', req: true, type: 'textarea', ph: '描述问题处理方案与结果' },
      { k: 'attach', label: '附件（可选）', ph: '支持 zip/pdf，≤10MB' },
      { k: 'remark', label: '备注', type: 'textarea', ph: '可选，补充信息' }
    ]},
    approve: { okText: '提交审批', fields: [
      { k: 'decision', label: '审批结论', req: true, type: 'select', opts: ['通过', '退回'], defaultIdx: 0 },
      { k: 'approveOpinion', label: '审批意见', req: true, type: 'textarea', ph: '必填，退回时说明原因' },
      { k: 'approver', label: '审批人', req: true, type: 'select', opts: ['张工单', '李工单', '王工单'] }
    ]}
  },
  refs: [
    [],
    ['已进入"处理中"状态（R-07 状态机不允许从处理中直接删除）'],
    ['已进入"待审批"状态（需先审批后归档）'],
    []
  ],
  validates: {
    add: function () { return ['工单填报由外部用户完成（D-03 边界），本页无新增入口']; },
    edit: function () { return ['工单不可编辑基础信息，请使用处理/审批入口']; },
    handle: function (v, row) {
      var errs = [];
      if (!v.conclusion || v.conclusion.trim() === '') errs.push('处理结论必填（R-07）');
      return errs;
    },
    approve: function (v, row) {
      var errs = [];
      if (!v.approveOpinion || v.approveOpinion.trim() === '') errs.push('审批意见必填');
      var handler = (row && row.owner) || '';
      if (handler && v.approver && handler.indexOf(v.approver) > -1) errs.push('审批人不可与处理人为同一人（R-08）');
      return errs;
    },
    delete: function (v, row) {
      var errs = [];
      if (row && row.status === '处理中') errs.push('处理中的工单不允许删除（R-07）');
      if (row && row.status === '待审批') errs.push('待审批的工单需先审批完成（R-07）');
      return errs;
    }
  }
},
{
  id: "P15",
  name: "帮助信息管理",
  group: "后台管理区",
  kind: "doc",
  roles: ["分级管理员","工作台管理员"],
  fp: "13 条（F-023、F-024、F-155～F-165）",
  fpShort: "13",
  desc: "维护帮助中心条目与目录：常见问题、操作指引，支持富文本、上下架与版本记录。",
  meta: "覆盖角色：分级 / 工作台管理员",
  scene: "用户咨询集中在少数问题；工作台管理员把标准答复沉淀为帮助条目，前台按目录展示，减少重复工单。",
  rules: ["帮助目录 ≤3 级，同级名称唯一。","条目标题 ≤50 字，正文必填；下架后前台不可见但保留历史。","每次修改生成版本记录，可回滚。","上架后才能被 P08 首页帮助区块选择。"],
  inputs: ["条目标题、所属目录、正文、关键词标签。","上下架操作；目录增删改移。","查询条件：标题、目录、状态。"],
  outputs: ["帮助条目列表与正文预览。","目录树与版本记录。","发布结果提示。"],
  errors: ["正文为空：阻断保存。","目录重名：阻断并提示。","删除被引用条目：提示首页引用影响。","发布失败：保留草稿并提示重试。"],
  accept: ["新增、修改、删除、查看、查询、上下架、版本记录 13 条功能点可用。","上架后 P08 可选中，下架后 P08 自动标灰。","版本记录可查看与回滚。","目录第 4 级被阻断。"],
  mapping: [["tree","帮助目录树","F-024 目录管理、F-162～F-165"],["content","帮助正文与上下架","F-023 帮助管理、F-155～F-160"],["content","版本记录","F-161 版本记录"],["note","目录与发布规则","R-05、R-06"]],
  treeTitle: "帮助目录",
  tree: [{"t":"帮助中心","lv":1},{"t":"账号与认证","lv":2,"on":true},{"t":"实名认证失败怎么办","lv":3,"on":true},{"t":"如何重置密钥","lv":3},{"t":"能力申请","lv":2},{"t":"接口调用","lv":2}],
  docTitle: "实名认证失败怎么办",
  docMeta: "所属目录：帮助中心 / 账号与认证 · 版本 v1.3 · 更新于 2026-10-24 · 状态 已上架",
  blocks: [{"h":"常见原因","p":"1. 证件照片模糊或反光；2. 姓名与证件号码不一致；3. 企业信息与营业执照不匹配。"},{"h":"处理步骤","p":"在「账号设置 - 实名认证」重新提交；如仍失败，可通过工单提交证件照片，由工单管理员人工核验。"},{"h":"关联内容","p":"相关帮助：如何重置密钥、开发者账号申请流程。"}],
  docBtn: "编辑并发布",
  note: "<b>规则：</b>目录 ≤3 级且同级唯一；上架后 P08 可选；下架保留历史版本，可回滚。",
  trace: "对应 03-prd.md 第 4 章 P15；功能点 F-023、F-024、F-155～F-165。",
},
{
  id: "P16",
  name: "应用案例管理",
  group: "后台管理区",
  kind: "table",
  roles: ["分级管理员","应用管理员"],
  fp: "8 条（F-025、F-166～F-172）",
  fpShort: "8",
  desc: "维护应用案例库：名称、服务商、封面、分类、正文与上下架，供首页与前台案例页使用。",
  meta: "覆盖角色：分级 / 应用管理员",
  scene: "优秀应用需要对外展示以带动接入；应用管理员维护案例内容并上架，前台 P21 与首页 P04 读取同一份数据。",
  rules: ["案例名称全库唯一；服务商、分类、封面必填。","上架后前台可见；下架保留记录与历史版本。","同一案例可被首页配置引用；下架时提示引用影响。","封面尺寸 750×420，≤2MB。"],
  inputs: ["案例名称、服务商、分类、封面、正文、跳转链接。","上/下架操作。","查询条件：名称、分类、状态。"],
  outputs: ["案例列表与详情。","上下架结果与版本记录。","前台案例页展示（P21）。"],
  errors: ["封面超限：阻断并提示 750×420 / ≤2MB。","名称重复：阻断并提示。","下架被首页引用：提示「首页配置将自动隐藏」。","删除被引用：阻断并列出引用页。"],
  accept: ["新增、修改、删除、查看、查询、上下架、版本记录 8 条功能点可用。","上架后 P21 与首页 1 分钟内出现。","下架后前台消失，后台保留记录。","封面规格校验生效。"],
  mapping: [["filter","筛选区","F-170 查询"],["toolbar","工具栏（新增案例）","F-166 新增"],["table","案例列表（封面 / 分类 / 状态）","F-025 管理、F-167 修改"],["row","行内操作（上下架 / 查看 / 删除）","F-171 上下架、F-169 查看、F-168 删除"],["pager","分页条","F-170 查询分页"]],
  filters: [{"label":"案例名称","ph":"请输入案例名称"},{"label":"分类","type":"select","opts":["全部","政务服务","民生服务","数据治理"]},{"label":"状态","type":"select","opts":["全部","已上架","已下架"]}],
  actions: [{"label":"新增案例","primary":true}],
  columns: [{"k":"cover","label":"封面","w":"80px","type":"thumb"},{"k":"name","label":"案例名称"},{"k":"provider","label":"服务商","w":"140px"},{"k":"cat","label":"分类","w":"110px"},{"k":"status","label":"状态","w":"90px","type":"tag"},{"k":"ops","label":"操作","w":"180px","type":"ops"}],
  rows: [{"cover":"案例 1","name":"赣服通 · 一网通办","provider":"云上江西","cat":"政务服务","status":"已上架","tagCls":"green","ops":["编辑","下架","查看"]},{"cover":"案例 2","name":"智慧社区 · 门禁通行","provider":"江西移动","cat":"民生服务","status":"已上架","tagCls":"green","thumbCls":"alt","ops":["编辑","下架","查看"]},{"cover":"案例 3","name":"政务云 · 数据治理","provider":"江西电信","cat":"数据治理","status":"已上架","tagCls":"green","thumbCls":"warn","ops":["编辑","下架","查看"]},{"cover":"案例 4","name":"智慧文旅 · 一码通游","provider":"江西联通","cat":"民生服务","status":"已下架","tagCls":"gray","ops":["编辑","上架","查看"]}],
  total: 4,
  note: "<b>联动：</b>本页维护案例内容；P04 只维护首页展示集合；P21 为前台浏览页。下架后首页与前台同步隐藏。",
  trace: "对应 03-prd.md 第 4 章 P16；功能点 F-025、F-166～F-172；规则 R-06。",
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
                      "k": "cat",
                      "label": "分类",
                      "req": false,
                      "type": "text",
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
                      "k": "cat",
                      "label": "分类",
                      "req": false,
                      "type": "text",
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
                      "k": "cat",
                      "label": "分类"
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
  id: "P17",
  name: "通知公告管理",
  group: "后台管理区",
  kind: "table",
  roles: ["分级管理员","工作台管理员"],
  fp: "11 条（F-026、F-173～F-182）",
  fpShort: "11",
  desc: "维护公告正文、有效期、置顶与上下架，是首页公告位与前台公告的唯一内容源。",
  meta: "覆盖角色：分级 / 工作台管理员",
  scene: "政策发布、系统维护、配额调整都需要公告触达开发者；管理员统一在本页维护正文与有效期，首页只挑选展示。",
  rules: ["标题 ≤50 字；正文富文本必填；有效期起止必填。","置顶最多 3 条，按置顶时间倒序（R-04）。","上架后前台可见；下架保留记录，前台立即消失。","批量删除单次 ≤20 条，且需二次确认。","已过期公告不可置顶，需先调整有效期。"],
  inputs: ["标题、正文、分类、有效期、置顶标记。","上/下架、批量删除。","查询条件：标题、分类、状态、有效期。"],
  outputs: ["公告列表（状态、有效期、置顶、阅读量）。","公告详情与发布结果。","前台公告展示（P19 公告区）。"],
  errors: ["有效期倒置：阻断并高亮字段。","正文为空：阻断发布。","批量删除超 20 条：阻断并提示。","删除已上架公告：二次确认并提示前台影响。"],
  accept: ["新增、修改、删除、批量删除、置顶、上下架、查看、查询 11 条功能点可用。","发布后首页公告位 1 分钟内可见。","撤回后前台立即消失，后台保留记录。","有效期倒置被阻断。"],
  mapping: [["filter","筛选区（标题 / 分类 / 状态）","F-180 查询、F-181 排序"],["toolbar","工具栏（新增 / 批量删除）","F-173 新增、F-176 批量删除"],["table","公告列表（有效期 / 置顶 / 阅读量）","F-026 管理、F-174 修改"],["row","行内操作（置顶 / 上下架 / 查看）","F-177 置顶、F-178 上下架、F-179 查看"],["pager","分页条","F-182 查询分页"]],
  filters: [{"label":"标题","ph":"请输入公告标题"},{"label":"分类","type":"select","opts":["全部","政策","维护","配额"]},{"label":"状态","type":"select","opts":["全部","已发布","草稿","已撤回"]}],
  actions: [{"label":"新增公告","primary":true},{"label":"批量删除","danger":true}],
  columns: [{"k":"title","label":"公告标题"},{"k":"cat","label":"分类","w":"90px"},{"k":"range","label":"有效期","w":"210px"},{"k":"top","label":"置顶","w":"70px","type":"tag"},{"k":"status","label":"状态","w":"90px","type":"tag"},{"k":"ops","label":"操作","w":"190px","type":"ops"}],
  rows: [{"title":"关于开放平台 API 网关升级的通知","cat":"维护","range":"2026-10-28 ~ 2026-11-10","top":"置顶","tagCls":"orange","status":"已发布","ops":["编辑","取消置顶","撤回"]},{"title":"2026 年第三季度接口调用配额调整说明","cat":"配额","range":"2026-10-20 ~ 2026-11-20","top":"置顶","tagCls":"orange","status":"已发布","ops":["编辑","取消置顶","撤回"]},{"title":"开放能力目录新增 12 个服务端接口","cat":"政策","range":"2026-10-15 ~ 2026-10-31","top":"—","tagCls":"gray","status":"已发布","ops":["编辑","置顶","撤回"]},{"title":"国庆期间服务保障安排","cat":"维护","range":"2026-09-28 ~ 2026-10-08","top":"—","tagCls":"gray","status":"已撤回","ops":["编辑","删除"]}],
  total: 4,
  note: "<b>规则：</b>置顶 ≤3 条；上架前台可见、撤回保留记录；已过期公告不可置顶。首页公告位（P02）仅可挑选已发布公告。",
  trace: "对应 03-prd.md 第 4 章 P17；功能点 F-026、F-173～F-182；规则 R-04/R-06。",
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
                      "k": "cat",
                      "label": "分类",
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
                      "k": "cat",
                      "label": "分类",
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
                      "k": "cat",
                      "label": "分类"
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
  id: "P18",
  name: "全局搜索管理",
  group: "后台管理区",
  kind: "table",
  roles: ["分级管理员","工作台管理员"],
  fp: "14 条（F-027、F-028、F-183～F-194）",
  fpShort: "14",
  desc: "配置前台全局搜索的范围、排序与热搜词，控制哪些模块可被检索、哪些词推荐。",
  meta: "覆盖角色：分级 / 工作台管理员",
  scene: "开发者习惯用搜索直达文档；运营通过配置搜索范围与热搜词，把流量导向重点能力与新上线的指南。",
  rules: ["搜索范围按模块开关：开放能力、开发资源、开发指南、帮助、案例，至少开启 1 个。","热搜词上限 20 个，同词唯一（R-10）；支持排序与生效时间。","停用热搜词前台不展示，历史保留。","默认排序：手动排序优先，其次按搜索热度。","配置保存后前台搜索 1 分钟内生效。"],
  inputs: ["模块开关（搜索范围）。","热搜词、排序值、生效时间、状态。","查询条件：热搜词、状态。"],
  outputs: ["搜索范围配置结果。","热搜词列表与前台效果预览（P22）。","保存结果与生效提示。"],
  errors: ["全部模块关闭：阻断保存并提示至少开启 1 个。","热搜词超过 20 个：阻断并提示当前数量。","重复热搜词：阻断并定位重复项。","生效时间无效：阻断并提示。"],
  accept: ["按查询范围 / 时间 / 排序 / 分类搜索 14 条功能点可用。","热搜词新增、修改、删除、批量删除、查看、排序可用。","关闭某模块后前台不再出现该模块结果。","第 21 个热搜词被阻断。"],
  mapping: [["tabs","热搜词 / 搜索范围页签","F-027 搜索管理、F-183 范围搜索"],["filter","筛选区","F-193 热搜词查询"],["toolbar","工具栏（新增热搜词 / 批量删除）","F-187 新增、F-190 批量删除"],["table","热搜词列表（排序 / 生效时间 / 状态）","F-028 热搜词管理、F-188 修改、F-194 排序"],["row","行内操作（编辑 / 停用 / 删除）","F-189 删除、F-191 查看"],["note","搜索范围配置","F-183～F-186、R-10"]],
  tabs: ["热搜词管理","搜索范围配置"],
  filters: [{"label":"热搜词","ph":"请输入关键词"},{"label":"状态","type":"select","opts":["全部","已启用","已停用"]}],
  actions: [{"label":"新增热搜词","primary":true},{"label":"批量删除","danger":true}],
  columns: [{"k":"word","label":"热搜词"},{"k":"sort","label":"排序","w":"104px","type":"sort"},{"k":"range","label":"生效时间","w":"210px"},{"k":"status","label":"状态","w":"90px","type":"tag"},{"k":"ops","label":"操作","w":"150px","type":"ops"}],
  rows: [{"word":"统一身份认证","sort":1,"range":"2026-10-01 ~ 长期","status":"已启用","tagCls":"green","ops":["编辑","停用","删除"]},{"word":"数据共享","sort":2,"range":"2026-10-01 ~ 长期","status":"已启用","tagCls":"green","ops":["编辑","停用","删除"]},{"word":"电子证照","sort":3,"range":"2026-10-20 ~ 2026-12-31","status":"已启用","tagCls":"green","ops":["编辑","停用","删除"]},{"word":"错误码","sort":4,"range":"2026-09-01 ~ 长期","status":"已停用","tagCls":"gray","ops":["编辑","启用","删除"]}],
  total: 4,
  note: "<b>搜索范围：</b><label><input type=\"checkbox\" checked> 开放能力</label>　<label><input type=\"checkbox\" checked> 开发资源</label>　<label><input type=\"checkbox\" checked> 开发指南</label>　<label><input type=\"checkbox\" checked> 帮助</label>　<label><input type=\"checkbox\"> 应用案例</label><br><b>规则：</b>至少开启 1 个模块；热搜词 ≤20 个且唯一（R-10）；停用词前台不展示。",
  trace: "对应 03-prd.md 第 4 章 P18；功能点 F-027、F-028、F-183～F-194；规则 R-10。",
  drawer: {
    add: {
          "okText": "确认新增",
          "fields": [
                {
                      "k": "word",
                      "label": "热搜词",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "range",
                      "label": "生效时间",
                      "req": false,
                      "type": "text",
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
                      "k": "word",
                      "label": "热搜词",
                      "req": false,
                      "type": "text",
                      "hint": "默认"
                },
                {
                      "k": "range",
                      "label": "生效时间",
                      "req": false,
                      "type": "text",
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
                      "k": "word",
                      "label": "热搜词"
                },
                {
                      "k": "sort",
                      "label": "排序"
                },
                {
                      "k": "range",
                      "label": "生效时间"
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
}
]);
