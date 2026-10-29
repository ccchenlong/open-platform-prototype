(function () {
  'use strict';

  var ROLES = ['分级管理员', '应用管理员', '工作台管理员', '工单管理员'];
  var STATES = [['normal', '正常'], ['empty', '空态'], ['loading', '加载'], ['error', '错误'], ['noperm', '无权限']];
  var GROUPS = ['总览', '前台配置区', '后台管理区', '前台浏览端'];
  var S = { page: 'P00', role: '分级管理员', state: 'normal', prd: true };
  var BUILD = '0.2.2';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function pages() { return window.PAGES || []; }
  function find(id) { for (var i = 0; i < pages().length; i++) if (pages()[i].id === id) return pages()[i]; return pages()[0]; }
  function allowed(p) { return p && p.roles && p.roles.indexOf(S.role) > -1; }
  function el(id) { return document.getElementById(id); }

  /* ---------------- 顶栏 ---------------- */
  function buildTop() {
    el('roleSel').innerHTML = ROLES.map(function (r) {
      return '<option' + (r === S.role ? ' selected' : '') + '>' + r + '</option>';
    }).join('');
    el('stateSeg').innerHTML = STATES.map(function (s) {
      return '<button data-state="' + s[0] + '"' + (s[0] === S.state ? ' class="active"' : '') + '>' + s[1] + '</button>';
    }).join('');
    el('buildTag').textContent = 'build-' + BUILD;
    el('prdBuild').textContent = 'build-' + BUILD;
  }

  /* ---------------- 左侧导航 ---------------- */
  function renderNav() {
    var h = '';
    GROUPS.forEach(function (g) {
      var items = pages().filter(function (p) { return p.group === g; });
      if (!items.length) return;
      h += '<div class="nav-group"><h5>' + esc(g) + '</h5>';
      items.forEach(function (p) {
        h += '<div class="nav-item' + (S.page === p.id ? ' active' : '') + (allowed(p) ? '' : ' locked') + '" data-page="' + p.id + '" title="' + esc(p.name) + '">' +
          '<span class="pid">' + p.id + '</span><span>' + esc(p.name) + '</span>' +
          (p.fpShort ? '<span class="fp">' + esc(p.fpShort) + '</span>' : '') + '</div>';
      });
      h += '</div>';
    });
    el('nav').innerHTML = h;
  }

  /* ---------------- 通用状态 ---------------- */
  function stateBox(ico, title, desc, btn, cls) {
    return '<div class="state-box"><div class="state-ico ' + (cls || '') + '">' + ico + '</div>' +
      '<h3>' + title + '</h3><p>' + desc + '</p>' +
      (btn ? '<button class="btn primary" data-action="reload">' + btn + '</button>' : '') + '</div>';
  }
  function skeleton() {
    var rows = '';
    for (var i = 0; i < 6; i++) {
      rows += '<div class="sk-row"><div class="sk" style="width:34px"></div><div class="sk" style="width:22%"></div>' +
        '<div class="sk" style="width:16%"></div><div class="sk" style="width:12%"></div><div class="sk" style="width:18%"></div>' +
        '<div class="sk" style="flex:1"></div></div>';
    }
    return '<div style="padding:8px 2px">' + rows + '</div>';
  }
  function stateGuard(kind) {
    if (S.state === 'noperm') return stateBox('403', '无权访问该页面', '权限判定：角色 → 权限组 → 机构数据范围（R-01）。', '申请权限', 'red');
    if (S.state === 'loading') {
      var sk = '<div class="card"><div class="sk" style="width:30%;height:18px;margin-bottom:10px"></div>' + skeleton() + '</div>';
      if (kind === 'dashboard') sk = '<div class="card">' + skeleton() + '</div>';
      return sk;
    }
    if (S.state === 'error') return stateBox('!', '加载失败', '接口超时（HTTP 504），筛选条件已保留。', '重新加载', 'red');
    if (S.state === 'empty') {
      var btnText = '新建第一条';
      if (kind === 'overview') btnText = '初始化';
      if (kind === 'home') btnText = '返回首页';
      return stateBox('空', '暂无数据', kind === 'overview' ? '尚未初始化页面与模块。' :
        kind === 'home' ? '门户内容尚未配置，请管理员在后台完成首屏配置。' :
        '当前筛选条件下没有记录，可调整条件或新建。', btnText, 'blue');
    }
    return null;
  }

  /* ---------------- 页面头 ---------------- */
  function head(p) {
    return '<div class="page-head"><div><h2>' + esc(p.name) + '</h2><p>' + esc(p.desc) + '</p></div>' +
      '<div class="page-meta">' + esc(p.fp || '') + '<br>' + esc(p.meta || '') + '</div></div>';
  }

  /* ---------------- 列表页 ---------------- */
  function viewTable(p) {
    var guard = stateGuard('table');
    if (guard) return guard;
    var h = '';
    if (p.tabs) {
      h += '<div class="tabs" data-anchor="tabs">' + p.tabs.map(function (t, i) {
        return '<div class="tab' + (i === 0 ? ' active' : '') + '" data-tab="' + i + '">' + esc(t) + '</div>';
      }).join('') + '</div>';
    }
    h += '<div class="card">';
    h += '<div class="filters" data-anchor="filter">';
    (p.filters || []).forEach(function (f, fi) {
      h += '<div class="field"><span>' + esc(f.label) + '</span>';
      if (f.type === 'select') {
        h += '<select data-filter="' + fi + '">' + (f.opts || []).map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>';
      } else {
        h += '<input data-filter="' + fi + '" placeholder="' + esc(f.ph || '') + '" value="' + esc(f.value || '') + '">';
      }
      h += '</div>';
    });
    h += '<button class="btn primary" data-action="query">查询</button><button class="btn" data-action="reset">重置</button></div>';

    h += '<div class="toolbar" data-anchor="toolbar">';
    (p.actions || [{ label: '新增', primary: true }]).forEach(function (a) {
      h += '<button class="btn' + (a.primary ? ' primary' : '') + (a.danger ? ' danger' : '') + '" data-action="' + (a.label === '新增' || a.label.indexOf('新增') > -1 ? 'add' : a.label) + '">' + esc(a.label) + '</button>';
    });
    h += '<span class="right" data-anchor="total">已选 0 项 · 共 ' + (p.total || (p.rows || []).length) + ' 条</span></div>';

    h += '<div data-anchor="table">';
    h += '<table class="grid"><thead><tr><th style="width:34px"><input type="checkbox" data-action="selectAll"></th><th style="width:44px">序号</th>';
    (p.columns || []).forEach(function (c) { h += '<th' + (c.w ? ' style="width:' + c.w + '"' : '') + '>' + esc(c.label) + '</th>'; });
    h += '</tr></thead><tbody>';
    (p.rows || []).forEach(function (r, i) {
      h += '<tr data-anchor="row" data-row="' + i + '"><td><input type="checkbox"></td><td>' + (i + 1) + '</td>';
      (p.columns || []).forEach(function (c) {
        var v = r[c.k];
        if (c.type === 'thumb') h += '<td><div class="thumb ' + (r.thumbCls || '') + '">' + esc(v) + '</div></td>';
        else if (c.type === 'tag') h += '<td><span class="tag ' + (r.tagCls || '') + '">' + esc(v) + '</span></td>';
        else if (c.type === 'sort') h += '<td><span class="ops"><a data-action="sortUp" data-row="' + i + '">↑</a><a data-action="sortDown" data-row="' + i + '">↓</a></span> ' + esc(v == null ? '' : v) + '</td>';
        else if (c.type === 'ops') h += '<td class="ops">' + (r.ops || ['编辑', '删除']).map(function (o) {
          var act = o === '编辑' || o === '编辑并发布' ? 'edit' : o === '删除' || o === '批量删除' ? 'delete' : o === '查看' || o === '查看详情' ? 'view' : o === '停用' || o === '撤回' || o === '下架' ? 'offline' : o === '上架' || o === '启用' ? 'online' : o === '置顶' ? 'top' : o === '审批' ? 'approve' : o === '处理' ? 'handle' : o === '认领' ? 'claim' : o === '取消置顶' ? 'untop' : o === '重新加载' ? 'reload' : o;
          return '<a data-action="' + act + '" data-row="' + i + '"' + (o === '删除' || o === '批量删除' ? ' class="danger"' : '') + '>' + esc(o) + '</a>';
        }).join('') + '</td>';
        else h += '<td>' + esc(v) + '</td>';
      });
      h += '</tr>';
    });
    h += '</tbody></table></div>';

    var total = p.total || (p.rows || []).length;
    h += '<div class="pager" data-anchor="pager"><span>共 ' + total + ' 条 · 每页 10 条</span>' +
      '<span class="pg"><span data-page="prev">‹</span><span class="on" data-page="1">1</span>' +
      (total > 10 ? '<span data-page="2">2</span>' : '') + (total > 20 ? '<span data-page="3">3</span>' : '') +
      '<span data-page="next">›</span></span></div>';
    h += '</div>';

    if (p.note) h += '<div class="note" data-anchor="note">' + p.note + '</div>';
    return h;
  }

  /* ---------------- 表单配置页 ---------------- */
  function viewForm(p) {
    var guard = stateGuard('form');
    if (guard) return guard;
    var h = '<div class="form-split"><div class="card" data-anchor="form">';
    h += '<div class="card-h">区块配置<span class="sub">保存后前台 1 分钟内生效</span></div>';
    (p.form || []).forEach(function (f, fi) {
      h += '<div class="form-row"><label>' + (f.req ? '<em>*</em>' : '') + esc(f.label) + '</label>';
      if (f.type === 'select') {
        h += '<select data-form="' + fi + '">' + (f.opts || []).map(function (o, oi) { return '<option' + (oi === (f.defaultIdx || 0) ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
      } else if (f.type === 'textarea') {
        h += '<textarea rows="3" placeholder="' + esc(f.ph || '') + '" data-form="' + fi + '">' + esc(f.value || '') + '</textarea>';
      } else if (f.type === 'switch') {
        h += '<div><span class="switch" data-form="' + fi + '" data-on="1"></span> <span style="font-size:12px;color:#4e5969">' + esc(f.value || '已启用') + '</span></div>';
      } else if (f.type === 'content') {
        h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">' +
          (f.value || []).map(function (v) { return '<span class="tag blue">' + esc(v) + '</span>'; }).join('') +
          '</div><button class="btn" data-action="choose">选择内容</button>';
      } else {
        h += '<input data-form="' + fi + '" value="' + esc(f.value || '') + '" placeholder="' + esc(f.ph || '') + '">';
      }
      if (f.hint) h += '<div class="hint">' + esc(f.hint) + '</div>';
      h += '</div>';
    });
    h += '<div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn" data-action="cancel">取消</button>' +
      '<button class="btn primary" data-action="save">保存并发布</button></div></div>';

    h += '<div class="preview" data-anchor="preview"><div class="pv-h">前台效果预览 · 门户首页</div>';
    h += '<div class="pv-block"><h6>' + esc(p.previewTitle || '区块标题') + '</h6>';
    (p.previewItems || []).forEach(function (it) { h += '<div class="pv-item">' + esc(it) + '</div>'; });
    h += '</div><div class="pv-block"><h6>区块规则</h6><div style="font-size:11px;color:#86909c;line-height:1.8">' +
      esc(p.previewRule || '按配置条数与排序方式展示；未配置时该区块自动隐藏。') + '</div></div></div></div>';
    return h;
  }

  /* ---------------- 指标页 ---------------- */
  function viewDashboard(p) {
    var guard = stateGuard('dashboard');
    if (guard) return guard;
    var h = '<div class="metrics" data-anchor="metrics">';
    (p.metrics || []).forEach(function (m) {
      h += '<div class="metric"><div class="k"><span>' + esc(m.k) + '</span><span>' + esc(m.fp || '') + '</span></div>' +
        '<div class="v">' + esc(m.v) + '</div><div class="d">' + esc(m.d) + '</div>' +
        '<div class="bar"><i style="width:' + (m.pct || 60) + '%"></i></div></div>';
    });
    h += '</div>';
    h += '<div class="card" data-anchor="trend" style="margin-top:14px"><div class="card-h">近 30 天趋势<span class="sub">口径固定，本页不可修改</span></div>';
    h += '<div style="height:120px;display:flex;align-items:flex-end;gap:8px">';
    var vals = [42, 55, 48, 62, 70, 58, 76, 66, 81, 74, 88, 92];
    vals.forEach(function (v) {
      h += '<div style="flex:1;height:' + v + '%;background:linear-gradient(180deg,#4080ff,#165dff);border-radius:6px 6px 0 0"></div>';
    });
    h += '</div><div style="display:flex;justify-content:space-between;font-size:11px;color:#a9aeb8;margin-top:6px">' +
      '<span>09-30</span><span>10-14</span><span>10-29</span></div></div>';
    if (p.note) h += '<div class="note" data-anchor="note">' + p.note + '</div>';
    return h;
  }

  /* ---------------- 文档页 ---------------- */
  function viewDoc(p) {
    var guard = stateGuard('doc');
    if (guard) return guard;
    var h = '<div class="doc">';
    h += '<div class="tree" data-anchor="tree"><h5>' + esc(p.treeTitle || '文档目录') + '</h5>';
    (p.tree || []).forEach(function (n) {
      h += '<div class="node' + (n.lv === 2 ? ' lv2' : n.lv === 3 ? ' lv3' : '') + (n.on ? ' on' : '') + '" data-node="' + n.t + '">' +
        (n.lv === 1 ? '▾ ' : '') + esc(n.t) + '</div>';
    });
    h += '</div>';

    h += '<div class="doc-body" data-anchor="content"><h3>' + esc(p.docTitle || p.name) + '</h3>' +
      '<div class="meta">' + esc(p.docMeta || '版本 v1.2 · 更新于 2026-10-28 · 应用：政务开放平台') + '</div>';
    if (p.docTabs) {
      h += '<div class="tabs" style="margin-bottom:12px" data-doc-tabs="' + p.id + '">' + p.docTabs.map(function (t, i) {
        return '<div class="tab' + (i === 0 ? ' active' : '') + '" data-doc-tab="' + i + '">' + esc(t) + '</div>';
      }).join('') + '</div>';
    }
    (p.blocks || []).forEach(function (b) {
      if (b.h) h += '<h4>' + esc(b.h) + '</h4>';
      if (b.p) h += '<p>' + esc(b.p) + '</p>';
      if (b.kv) h += '<dl class="kv">' + b.kv.map(function (kv) { return '<dt>' + esc(kv[0]) + '</dt><dd>' + esc(kv[1]) + '</dd>'; }).join('') + '</dl>';
      if (b.code) h += '<div class="code"><div style="text-align:right;font-size:11px;color:#a9aeb8;margin-bottom:6px;cursor:pointer" data-action="copy">复制代码</div>' + esc(b.code) + '</div>';
    });
    h += '<div style="display:flex;gap:8px;margin-top:16px"><button class="btn primary" data-action="editDoc">' + esc(p.docBtn || '编辑文档') + '</button>' +
      '<button class="btn">版本记录</button><button class="btn">预览</button></div>';
    h += '</div></div>';
    return h;
  }

  /* ---------------- 门户首页 ---------------- */
  function viewHome(p) {
    var guard = stateGuard('home');
    if (guard) return guard;
    var h = '<div class="hero" data-anchor="hero"><h3>江西省政务开放平台</h3>' +
      '<p>汇聚开放能力、开发资源与接入指南，一站式完成应用接入</p>' +
      '<div class="searchbar"><input placeholder="搜索 API、文档、案例"><button data-go="P22">搜索</button></div></div>';
    h += '<div class="banners" data-anchor="banner">' +
      '<div class="banner"><b>统一身份认证</b>一次接入，全域通行</div>' +
      '<div class="banner"><b>数据共享服务</b>按需申请，安全可控</div>' +
      '<div class="banner"><b>移动端能力</b>扫码、定位、消息推送</div></div>';
    h += '<div class="card" data-anchor="notice"><div class="card-h">通知公告<span class="sub">来自后台 P17 · 置顶优先</span></div>' +
      '<div class="pv-item">关于开放平台 API 网关升级的通知（置顶）</div>' +
      '<div class="pv-item">2026 年第三季度接口调用配额调整说明</div>' +
      '<div class="pv-item">开放能力目录新增 12 个服务端接口</div></div>';
    h += '<div class="steps" data-anchor="steps">' +
      '<div class="step"><div class="no">1</div><h6>注册开发者</h6><p>实名认证，创建应用</p></div>' +
      '<div class="step"><div class="no">2</div><h6>申请能力</h6><p>选择 API 并提交申请</p></div>' +
      '<div class="step"><div class="no">3</div><h6>联调上线</h6><p>按文档联调，发布上线</p></div></div>';
    h += '<div class="card" data-anchor="cases" style="margin-top:14px"><div class="card-h">应用案例<span class="sub">来自后台 P16 · 仅展示已发布</span></div>' +
      '<div class="cards3">' + ['赣服通 · 一网通办', '智慧社区 · 门禁通行', '政务云 · 数据治理'].map(function (t, i) {
        return '<div class="case"><div class="cover" style="background:linear-gradient(135deg,' + ['#165dff,#4080ff', '#00b42a,#23c343', '#ff7d00,#ffb65d'][i] + ')">案例封面</div><div class="body"><b>' + t + '</b><p>服务商：云上江西</p></div></div>';
      }).join('') + '</div></div>';
    h += '<div class="metrics" data-anchor="metrics" style="margin-top:14px">' +
      '<div class="metric"><div class="k">应用上架数</div><div class="v">1,286</div><div class="d">较上月 +4.2%</div></div>' +
      '<div class="metric"><div class="k">API 调用量</div><div class="v">3,842 万</div><div class="d">近 30 天</div></div>' +
      '<div class="metric"><div class="k">用户活跃数</div><div class="v">28.6 万</div><div class="d">近 30 天</div></div>' +
      '<div class="metric"><div class="k">通知数</div><div class="v">96</div><div class="d">本月发布</div></div></div>';
    if (p.note) h += '<div class="note" data-anchor="note" style="margin-top:14px">' + p.note + '</div>';
    return h;
  }

  /* ---------------- 卡片列表 ---------------- */
  function viewCards(p) {
    var guard = stateGuard('cards');
    if (guard) return guard;
    var h = '<div class="card" data-anchor="filter" style="padding:12px 16px"><div class="filters" style="border:0;margin:0;padding:0">' +
      (p.filters || []).map(function (f) {
        return '<div class="field"><span>' + esc(f.label) + '</span><select>' + (f.opts || []).map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select></div>';
      }).join('') + '<button class="btn primary">筛选</button></div></div>';
    h += '<div class="cards3" data-anchor="cards">';
    (p.cards || []).forEach(function (c) {
      h += '<div class="case"><div class="cover" style="background:' + (c.bg || 'linear-gradient(135deg,#165dff,#4080ff)') + '">' + esc(c.tag || '案例封面') + '</div>' +
        '<div class="body"><b>' + esc(c.title) + '</b><p>' + esc(c.desc) + '</p></div></div>';
    });
    h += '</div>';
    if (p.note) h += '<div class="note" data-anchor="note" style="margin-top:14px">' + p.note + '</div>';
    return h;
  }

  /* ---------------- 全局搜索页 ---------------- */
  function viewSearch(p) {
    var guard = stateGuard('search');
    if (guard) return guard;
    var h = '<div class="searchwrap"><div class="searchbig" data-anchor="search"><input value="' + esc(p.keyword || '身份认证') + '" placeholder="搜索 API、文档、案例、指南"><button data-action="search">搜索</button></div>';
    h += '<div class="hot" data-anchor="hot"><span>热搜：</span>' +
      (p.hot || []).map(function (t, i) { return '<span class="' + (i === 0 ? 'on' : '') + '" data-action="hotword" data-word="' + esc(t) + '">' + esc(t) + '</span>'; }).join('') + '</div>';
    (p.groups || []).forEach(function (g) {
      h += '<div class="sgroup" data-anchor="result"><h4>' + esc(g.t) + '<span class="cnt">' + g.items.length + ' 条</span></h4>';
      g.items.forEach(function (it) {
        h += '<div class="sitem"><b>' + esc(it.t) + '</b><p>' + esc(it.d) + '</p></div>';
      });
      h += '</div>';
    });
    h += '</div>';
    if (p.note) h += '<div class="note" data-anchor="note" style="margin-top:14px">' + p.note + '</div>';
    return h;
  }

  /* ---------------- 框架总览 ---------------- */
  function viewOverview(p) {
    var guard = stateGuard('overview');
    if (guard) return guard;
    var h = '';
    h += '<div class="card" data-anchor="arch"><div class="card-h">总体架构<span class="sub">后台配置 → 前台呈现 的闭环</span></div><div class="layers">';
    var layers = [
      ['接入层', ['统一门户', '管理后台', '开放 API', '统一认证']],
      ['应用层', ['门户首页配置', '开放能力管理', '工单与公告', '全局搜索'], true],
      ['服务层', ['内容服务', '文档服务', '工单服务', '权限服务']],
      ['数据层', ['内容库', '文档库', '工单库', '日志与指标']]
    ];
    layers.forEach(function (l) {
      h += '<div class="layer"><div class="lname">' + l[0] + '</div><div class="lbox">' + l[1].map(function (it) {
        return '<div class="litem' + (l[2] ? ' hi' : '') + '">' + it + '</div>';
      }).join('') + '</div></div>';
    });
    h += '</div></div>';

    h += '<div class="card" data-anchor="ia"><div class="card-h">信息架构<span class="sub">22 页 / 4 组</span></div><div class="ia">';
    var ia = [
      ['前台配置区（门户）', ['P01 轮播图配置', 'P02 通知公告配置', 'P03 接入步骤配置', 'P04 应用案例配置', 'P05–P08 四类首页区块', 'P09 指标展示']],
      ['后台管理区（门户管理）', ['P10 接入步骤管理', 'P11 开发资源管理', 'P12 开发指南管理', 'P13 开放能力管理（42 条）', 'P14 我的工单', 'P15 帮助信息管理', 'P16 应用案例管理', 'P17 通知公告管理', 'P18 全局搜索管理']],
      ['前台浏览端（D-01）', ['P19 门户首页浏览', 'P20 开放能力文档浏览', 'P21 应用案例浏览', 'P22 全局搜索浏览']],
      ['公共能力', ['角色 → 权限组 → 机构', '首页区块即时生效', '工单三级流转', '文档目录 ≤3 级']]
    ];
    ia.forEach(function (c) {
      h += '<div class="ia-col"><h6>' + c[0] + '</h6><ul>' + c[1].map(function (it) { return '<li>' + it.replace(/^(P\d+)/, '<b>$1</b>') + '</li>'; }).join('') + '</ul></div>';
    });
    h += '</div></div>';

    h += '<div class="card" data-anchor="flow"><div class="card-h">三条主流程<span class="sub">验收以此为准（C-05）</span></div>';
    var flows = [
      ['A 首页运营', ['配置轮播/公告', '选择内容区块', '保存发布', '前台 ≤1 分钟生效']],
      ['B 能力发布', ['新增 API 说明', '维护文档目录', '维护示例与错误码', '门户可检索']],
      ['C 工单处理', ['外部用户提交', '工单管理员处理', '审批通过/退回', '完成并归档']]
    ];
    flows.forEach(function (f, i) {
      h += '<div style="margin:' + (i ? '14px' : '0') + ' 0"><div style="font-size:12px;color:#86909c;margin-bottom:6px">' + f[0] + '</div><div class="flow">' +
        f[1].map(function (s, j) {
          return (j ? '<span class="ar">→</span>' : '') + '<span class="n">' + s + '</span>';
        }).join('') + '</div></div>';
    });
    h += '</div>';

    h += '<div class="card" data-anchor="matrix"><div class="card-h">角色 × 页面权限矩阵<span class="sub">● 可见 / ○ 越权拦截（403 态）</span></div>' + matrixHTML() + '</div>';

    h += '<div class="card" data-anchor="dict"><div class="card-h">核心数据字典<span class="sub">8 个对象</span></div>' + dictHTML() + '</div>';

    h += '<div class="card" data-anchor="nfr"><div class="card-h">非功能需求<span class="sub">N1–N6</span></div>' + nfrHTML() + '</div>';
    return h;
  }

  function matrixHTML() {
    var rows = [
      ['P01–P04 首页内容配置', 1, 0, 1, 0],
      ['P05–P08 首页区块配置', 1, 1, 1, 0],
      ['P09 指标展示', 1, 0, 1, 0],
      ['P10–P13 能力/资源/指南', 1, 1, 0, 0],
      ['P14 我的工单', 1, 0, 0, 1],
      ['P15–P18 帮助/案例/公告/搜索', 1, 1, 1, 0],
      ['P19–P22 前台浏览', 1, 1, 1, 1]
    ];
    var h = '<table class="matrix"><tr><th>页面组</th><th>分级管理员</th><th>应用管理员</th><th>工作台管理员</th><th>工单管理员</th></tr>';
    rows.forEach(function (r) {
      h += '<tr><td>' + r[0] + '</td>' + r.slice(1).map(function (v) {
        return '<td class="' + (v ? 'yes' : 'no') + '">' + (v ? '●' : '○') + '</td>';
      }).join('') + '</tr>';
    });
    return h + '</table>';
  }
  function dictHTML() {
    var rows = [
      ['carousel', '轮播图', '标题/图片/跳转/排序/状态', 'P01'],
      ['notice', '通知公告', '标题/正文/有效期/置顶/状态', 'P02 P17'],
      ['api_doc', 'API 文档', '所属应用/版本/目录/示例/错误码', 'P13 P20'],
      ['resource', '开发资源', '名称/类型/文件/版本/下载量', 'P11'],
      ['guide', '开发指南', '标题/目录/正文/版本', 'P12'],
      ['ticket', '工单', '编号/标题/提交人/状态/SLA', 'P14'],
      ['hotword', '热搜词', '词语/排序/生效时间/状态', 'P18 P22'],
      ['case', '应用案例', '名称/服务商/封面/分类/状态', 'P04 P16 P21']
    ];
    var h = '<table class="matrix" style="text-align:left"><tr><th>对象</th><th>中文名</th><th>关键字段</th><th>关联页</th></tr>';
    rows.forEach(function (r) { h += '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td style="text-align:left">' + r[2] + '</td><td>' + r[3] + '</td></tr>'; });
    return h + '</table>';
  }
  function nfrHTML() {
    var rows = [
      ['N1 性能', '列表首屏 ≤2s（P95），首页接口 ≤800ms'],
      ['N2 容量', '单列表 10 万条分页可查；导出上限 1 万条/次'],
      ['N3 可用性', '后台可用性 ≥99.5%，发布失败可回滚'],
      ['N4 安全', 'RBAC + 机构隔离；越权返回 403 并留痕'],
      ['N5 兼容', 'Chrome/Edge 最新两个版本，≥1280 桌面'],
      ['N6 时效', '配置保存到前台生效 ≤1 分钟']
    ];
    return '<table class="matrix" style="text-align:left"><tr><th>编号</th><th>要求</th></tr>' +
      rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td style="text-align:left">' + r[1] + '</td></tr>'; }).join('') + '</table>';
  }

  /* ---------------- 视图分发 ---------------- */
  function body(p) {
    switch (p.kind) {
      case 'overview': return viewOverview(p);
      case 'form': return viewForm(p);
      case 'dashboard': return viewDashboard(p);
      case 'doc': return viewDoc(p);
      case 'home': return viewHome(p);
      case 'cards': return viewCards(p);
      case 'search': return viewSearch(p);
      default: return viewTable(p);
    }
  }

  function renderStage() {
    var p = find(S.page);
    el('crumb').innerHTML = '开放平台<i>/</i>' + esc(p.group) + '<i>/</i><b>' + p.id + ' ' + esc(p.name) + '</b>';

    var html;
    if (!allowed(p)) {
      html = head(p) + stateBox('403', '无权访问该页面', '当前角色「' + S.role + '」未获得「' + p.name + '」的权限，可向本级管理员申请权限组。', '申请权限', 'red');
    } else {
      html = head(p) + body(p);
    }
    html += '<div class="note" style="margin-top:2px">build-' + BUILD + ' · ' + p.id + ' · 五态在顶栏切换（正常 / 空 / 加载 / 错误 / 无权限）· 页面编号与字段取自 project-spec.md</div>';
    el('viewport').innerHTML = html;
    el('viewport').scrollTop = 0;
  }

  /* ---------------- PRD 面板 ---------------- */
  function renderPRD() {
    var p = find(S.page);
    var chips = '<span class="chip blue">' + esc(p.fp || '框架') + '</span>' +
      (p.roles || []).map(function (r) { return '<span class="chip">' + r + '</span>'; }).join('');
    el('prdHead').innerHTML = '<div class="line1"><span class="prd-id">' + p.id + '</span><h3>' + esc(p.name) + '</h3>' +
      '<div class="prd-tools"><a href="../03-prd-preview.html" target="_blank">完整 PRD</a><button id="prdCollapse">收起</button></div></div>' +
      '<div class="line2">' + chips + '</div>';

    var h = '';
    h += sec('功能名称', '<p>' + esc(p.fname || p.desc) + '</p>');
    h += sec('用户场景', '<p>' + esc(p.scene || '—') + '</p>');
    h += sec('业务规则', list(p.rules));
    h += sec('输入', list(p.inputs));
    h += sec('输出', list(p.outputs));
    h += sec('异常处理', list(p.errors));
    h += sec('验收标准', list(p.accept));

    if (p.mapping) {
      h += '<div class="prd-sec"><h4>原型元素映射</h4><table><tr><th>原型元素</th><th>需求条目</th></tr>' +
        p.mapping.map(function (m) {
          return '<tr class="map-row" data-anchor="' + m[0] + '"><td>' + esc(m[1]) + '</td><td>' + esc(m[2]) + '</td></tr>';
        }).join('') + '</table></div>';
    }
    (p.extras || []).forEach(function (x) {
      h += '<div class="prd-sec"><h4>' + esc(x.title) + '</h4>' + x.html + '</div>';
    });
    h += '<div class="prd-note"><b>追溯：</b>' + esc(p.trace || '页面编号与字段取自 project-spec.md；功能点见 03-prd-功能清单.md；规则编号见 03-prd.md 第 5 章。') + '</div>';
    el('prdBody').innerHTML = h;
    el('prdBody').scrollTop = 0;
  }
  function sec(title, inner) { return '<div class="prd-sec"><h4>' + title + '</h4>' + inner + '</div>'; }
  function list(arr) {
    if (!arr || !arr.length) return '<p>—</p>';
    return '<ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }

  /* ---------------- 渲染入口 ---------------- */
  function render() {
    buildTop();
    renderNav();
    renderStage();
    renderPRD();
    el('app').classList.toggle('prd-off', !S.prd);
    el('prdToggle').textContent = S.prd ? '收起 PRD' : '展开 PRD';
  }

  /* ============================================================
     N4 新增：交互层（抽屉 / 二次确认 / Toast / 校验 / 联动）
     ============================================================ */

  function toast(msg, kind) {
    kind = kind || 'info';
    var box = document.getElementById('__toast_box');
    if (!box) {
      box = document.createElement('div');
      box.id = '__toast_box';
      box.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10000;display:flex;flex-direction:column;gap:6px;pointer-events:none';
      document.body.appendChild(box);
    }
    var c = document.createElement('div');
    var colors = { success: '#00b42a', error: '#f53f3f', warning: '#ff7d00', info: '#165dff' };
    c.style.cssText = 'background:#fff;border:1px solid ' + (colors[kind] || '#165dff') + ';border-radius:8px;padding:10px 16px;font-size:12px;color:#1d2129;box-shadow:0 4px 20px rgba(0,0,0,.12);pointer-events:auto;opacity:0;transition:opacity .2s';
    c.textContent = msg;
    box.appendChild(c);
    requestAnimationFrame(function () { c.style.opacity = '1'; });
    setTimeout(function () {
      c.style.opacity = '0';
      setTimeout(function () { c.remove(); }, 200);
    }, 2400);
  }

  function confirmDialog(title, bodyHtml, onOk, okText) {
    var mask = document.createElement('div');
    mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9999;display:grid;place-items:center';
    mask.innerHTML = '<div style="width:420px;background:#fff;border-radius:12px;padding:20px 22px;box-shadow:0 12px 40px rgba(0,0,0,.2)">' +
      '<div style="font-size:15px;font-weight:600;margin-bottom:8px">' + esc(title) + '</div>' +
      '<div style="font-size:12px;color:#4e5969;line-height:1.7;margin-bottom:18px">' + bodyHtml + '</div>' +
      '<div style="display:flex;justify-content:flex-end;gap:8px">' +
      '<button class="btn" id="cd-cancel">取消</button>' +
      '<button class="btn ' + (okText === '删除' || okText === '批量删除' ? 'danger' : 'primary') + '" id="cd-ok">' + esc(okText || '确定') + '</button></div></div>';
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) {
      if (e.target === mask) mask.remove();
      if (e.target.id === 'cd-cancel') mask.remove();
      if (e.target.id === 'cd-ok') {
        mask.remove();
        try { onOk && onOk(); } catch (err) { toast('操作失败：' + err.message, 'error'); }
      }
    });
  }

  function drawerBuild(p, mode, row) {
    var w = p.drawer ? p.drawer[mode] : null;
    if (!w) return null;
    w = JSON.parse(JSON.stringify(w)); // 深拷贝
    if (mode !== 'add' && row) {
      (w.fields || []).forEach(function (f) {
        if (row[f.k] != null) f.value = row[f.k];
      });
    }
    return w;
  }

  function openDrawer(p, mode, row) {
    var w = drawerBuild(p, mode, row);
    var title;
    if (mode === 'add') title = '新增';
    else if (mode === 'edit') title = '编辑';
    else if (mode === 'view') title = '查看';
    else if (mode === 'delete') title = '删除确认';
    else if (mode === 'handle') title = '处理工单';
    else if (mode === 'approve') title = '审批工单';
    else title = p.name;
    title += ' · ' + p.id;

    var mask = document.createElement('div');
    mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.25);z-index:9999';
    mask.innerHTML = '<div style="position:absolute;right:0;top:0;bottom:0;width:520px;background:#fff;border-left:1px solid #e5e6eb;box-shadow:-8px 0 24px rgba(0,0,0,.08);display:flex;flex-direction:column">' +
      '<div style="padding:14px 20px;border-bottom:1px solid #e5e6eb;display:flex;align-items:center;gap:10px">' +
      '<span class="prd-id">' + p.id + '</span><div style="font-size:15px;font-weight:600;flex:1">' + esc(title) + '</div>' +
      '<span style="cursor:pointer;color:#86909c;font-size:20px;line-height:1" id="draw-close">×</span></div>' +
      '<div id="draw-body" style="flex:1;overflow:auto;padding:20px">' + (w ? drawerFields(w.fields || [], mode === 'view') : '') + '</div>' +
      '<div style="padding:14px 20px;border-top:1px solid #e5e6eb;display:flex;justify-content:flex-end;gap:8px">' +
      '<button class="btn" id="draw-cancel">取消</button>' +
      (mode === 'view' ? '' : '<button class="btn primary" id="draw-ok">' + esc(w && w.okText ? w.okText : '保存') + '</button>') +
      '</div></div>';
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) {
      if (e.target === mask || e.target.id === 'draw-close' || e.target.id === 'draw-cancel') mask.remove();
      if (e.target.id === 'draw-ok') {
        if (!w) { mask.remove(); return; }
        // 收集值并校验
        var values = {};
        var errors = [];
        (w.fields || []).forEach(function (f) {
          var el = mask.querySelector('[data-d="' + f.k + '"]');
          var val = el ? (el.type === 'checkbox' ? el.checked : el.value) : f.value;
          values[f.k] = val;
          if (f.req && (val == null || val === '')) errors.push((f.label || f.k) + ' 必填');
          if (f.maxLen && typeof val === 'string' && val.length > f.maxLen) errors.push((f.label || f.k) + ' 长度 ≤' + f.maxLen);
          if (f.kind === 'number' && val != null && val !== '' && isNaN(Number(val))) errors.push((f.label || f.k) + ' 必须为数字');
        });
        // 调用自定义校验
        var pageRuleCheck = p.validates && p.validates[mode];
        if (pageRuleCheck) {
          var extra = pageRuleCheck(values, row);
          if (extra && extra.length) extra.forEach(function (e) { errors.push(e); });
        }
        if (errors.length) {
          toast(errors[0], 'error');
          return;
        }
        // 模拟保存 / 编辑
        if (mode === 'add') toast('已新增 1 条记录（Mock）', 'success');
        else if (mode === 'edit') toast('已保存修改（Mock）', 'success');
        mask.remove();
        S.state = 'loading';
        render();
        setTimeout(function () { S.state = 'normal'; render(); toast('前台 ≤1 分钟生效（Mock）', 'info'); }, 400);
      }
    });
  }

  function drawerFields(fields, readOnly) {
    if (!fields || !fields.length) return '<div class="note">该页面暂无抽屉表单配置。</div>';
    var h = '';
    fields.forEach(function (f) {
      h += '<div class="form-row"><label>' + (f.req ? '<em>*</em>' : '') + esc(f.label) + '</label>';
      if (f.type === 'select') {
        h += '<select data-d="' + esc(f.k) + '"' + (readOnly ? ' disabled' : '') + '>' + (f.opts || []).map(function (o, oi) {
          return '<option' + (oi === (f.defaultIdx || 0) ? ' selected' : '') + '>' + esc(o) + '</option>';
        }).join('') + '</select>';
      } else if (f.type === 'textarea') {
        h += '<textarea data-d="' + esc(f.k) + '" rows="4" placeholder="' + esc(f.ph || '') + '"' + (readOnly ? ' disabled' : '') + '>' + esc(f.value || '') + '</textarea>';
      } else {
        h += '<input data-d="' + esc(f.k) + '" value="' + esc(f.value || '') + '" placeholder="' + esc(f.ph || '') + '"' + (readOnly ? ' disabled' : '') + '>';
      }
      if (f.hint) h += '<div class="hint">' + esc(f.hint) + '</div>';
      h += '</div>';
    });
    return h;
  }

  function doDelete(p, rowIdx) {
    var row = (p.rows || [])[rowIdx] || {};
    var refs = p.refs && p.refs[rowIdx];
    var html = '确认删除该记录吗？' + (refs && refs.length ? '<br><span style="color:#f53f3f">当前记录被以下位置引用：' + refs.join('、') + '，删除后可能影响其他模块展示。</span>' :
      '<br><span style="color:#86909c">此操作不可撤销，请确认。</span>');
    confirmDialog('删除确认', html, function () {
      toast('已删除 1 条记录（Mock）', 'success');
    }, '删除');
  }

  /* ---------------- 事件委派 ---------------- */
  el('viewport').addEventListener('click', function (e) {
    var a = e.target.closest('[data-action]');
    if (!a) return;
    var act = a.getAttribute('data-action');
    var p = find(S.page);
    var rowIdx = Number(a.getAttribute('data-row'));

    if (act === 'add') { openDrawer(p, 'add', null); return; }
    if (act === 'edit' || act === 'editDoc') { openDrawer(p, 'edit', p.kind === 'doc' ? null : (p.rows || [])[rowIdx]); return; }
    if (act === 'view') { openDrawer(p, 'view', (p.rows || [])[rowIdx]); return; }
    if (act === 'delete') { doDelete(p, rowIdx); return; }
    if (act === 'reload') { S.state = 'loading'; render(); setTimeout(function () { S.state = 'normal'; render(); toast('加载成功', 'success'); }, 400); return; }
    if (act === 'cancel') { toast('已取消', 'info'); return; }
    if (act === 'save') { S.state = 'loading'; render(); setTimeout(function () { S.state = 'normal'; render(); toast('保存成功（Mock）', 'success'); }, 400); return; }
    if (act === 'choose') { toast('内容选择弹窗（Mock）：请从 P11/P12/P13 等模块挑选已上架条目', 'info'); return; }
    if (act === 'search') { toast('搜索提交（Mock）', 'success'); return; }
    if (act === 'hotword') { toast('热搜词「' + a.getAttribute('data-word') + '」搜索（Mock）', 'success'); return; }
    if (act === 'copy') { toast('示例代码已复制到剪贴板（Mock）', 'success'); return; }
    if (act === 'query') { toast('已按筛选条件查询（Mock）', 'success'); return; }
    if (act === 'reset') { toast('已重置筛选条件（Mock）', 'info'); render(); return; }
    if (act === 'claim') { toast('已认领该工单（Mock）', 'success'); return; }
    if (act === 'handle') { openDrawer(p, 'handle', (p.rows || [])[rowIdx]); return; }
    if (act === 'approve') { openDrawer(p, 'approve', (p.rows || [])[rowIdx]); return; }
    if (act === 'offline') { toast('已下架（Mock），前台 1 分钟内生效', 'success'); return; }
    if (act === 'online') { toast('已上架（Mock），前台 1 分钟内生效', 'success'); return; }
    if (act === 'top') { toast('已置顶（Mock）', 'success'); return; }
    if (act === 'untop') { toast('已取消置顶（Mock）', 'info'); return; }
    if (act === 'sortUp' || act === 'sortDown') { toast('排序已更新（Mock）', 'success'); return; }
    if (act === 'selectAll') {
      var checked = a.checked;
      var tbody = el('viewport').querySelectorAll('tbody tr td input[type=checkbox]');
      tbody.forEach(function (c) { c.checked = checked; });
      return;
    }
  });
  // 分页 / Tab / 节点 点击
  el('viewport').addEventListener('click', function (e) {
    var tab = e.target.closest('.tab[data-tab], .tab[data-doc-tab], [data-node], [data-page]');
    if (tab) {
      if (tab.hasAttribute('data-tab')) {
        var idx = tab.getAttribute('data-tab');
        var tabs = tab.parentElement.querySelectorAll('.tab[data-tab]');
        tabs.forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-tab') === idx); });
        toast('切换 Tab：' + tab.textContent, 'info');
      } else if (tab.hasAttribute('data-doc-tab')) {
        var di = tab.getAttribute('data-doc-tab');
        var dtabs = tab.parentElement.querySelectorAll('.tab[data-doc-tab]');
        dtabs.forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-doc-tab') === di); });
        toast('切换页签：' + tab.textContent, 'info');
      } else if (tab.hasAttribute('data-node')) {
        var nodes = tab.parentElement.querySelectorAll('.node');
        nodes.forEach(function (n) { n.classList.remove('on'); });
        tab.classList.add('on');
        toast('切换到节点：' + tab.textContent.trim(), 'info');
      } else if (tab.hasAttribute('data-page')) {
        var label = tab.textContent.trim();
        toast('翻页：' + (label === '‹' ? '上一页' : label === '›' ? '下一页' : '第 ' + label + ' 页'), 'info');
      }
      return;
    }
    var go = e.target.closest('[data-go]');
    if (go) {
      S.page = go.getAttribute('data-go');
      S.state = 'normal';
      render();
      return;
    }
  });

  /* ---------------- 顶部事件 ---------------- */
  el('nav').addEventListener('click', function (e) {
    var it = e.target.closest('[data-page]');
    if (!it) return;
    S.page = it.getAttribute('data-page');
    S.state = 'normal';
    render();
  });
  el('roleSel').addEventListener('change', function (e) {
    S.role = e.target.value;
    var cp = find(S.page);
    if (!allowed(cp)) {
      S.page = 'P00';
      toast('当前页对「' + e.target.value + '」无权限，已切换到框架总览', 'warning');
    }
    render();
  });
  el('stateSeg').addEventListener('click', function (e) {
    var b = e.target.closest('[data-state]');
    if (!b) return;
    S.state = b.getAttribute('data-state');
    render();
  });
  el('prdToggle').addEventListener('click', function () { S.prd = !S.prd; el('app').classList.toggle('prd-off', !S.prd); el('prdToggle').textContent = S.prd ? '收起 PRD' : '展开 PRD'; });
  document.addEventListener('click', function (e) {
    if (e.target.id === 'prdCollapse') { S.prd = false; el('app').classList.add('prd-off'); el('prdToggle').textContent = '展开 PRD'; return; }
  });

  // 映射行 → 高亮原型元素
  el('prdBody').addEventListener('click', function (e) {
    var row = e.target.closest('.map-row');
    if (!row) return;
    var a = row.getAttribute('data-anchor');
    clearHL();
    row.classList.add('on');
    Array.prototype.forEach.call(el('viewport').querySelectorAll('[data-anchor="' + a + '"]'), function (n) {
      n.classList.add('hl');
      n.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });
  el('viewport').addEventListener('click', function (e) {
    var n = e.target.closest('[data-anchor]');
    if (!n) return;
    var a = n.getAttribute('data-anchor');
    clearHL();
    var rows = el('prdBody').querySelectorAll('.map-row[data-anchor="' + a + '"]');
    if (rows.length) {
      Array.prototype.forEach.call(rows, function (r) { r.classList.add('on'); });
      rows[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
      n.classList.add('hl');
    }
  });
  function clearHL() {
    Array.prototype.forEach.call(document.querySelectorAll('.hl'), function (n) { n.classList.remove('hl'); });
    Array.prototype.forEach.call(document.querySelectorAll('.map-row.on'), function (n) { n.classList.remove('on'); });
  }

  // 回到上次浏览页
  try {
    var last = sessionStorage.getItem('proto-page');
    if (last && find(last)) S.page = last;
  } catch (err) {}
  window.addEventListener('beforeunload', function () {
    try { sessionStorage.setItem('proto-page', S.page); } catch (err) {}
  });

  render();
})();
