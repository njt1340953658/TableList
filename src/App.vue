<template>
  <div class="contaniner">
    <span>本地测试引入表格组件库开发</span>
    <br />
    <TableList
      border
      :options="options"
      :value="formVal"
      :rules="rules"
      :search="tableSearch"
      :columns="columns"
      :dataSource="dataSource"
      :extendButton="extendButton(this)"
      :operates="operates(this)"
      :pagination="pagination"
    />
  </div>
</template>

<script>
// 搜索设置
const tableSearch = [
  {
    label: "姓名ID/手机号",
    inputType: "number",
    maxlength: 11,
    value: "name",
    rulesLength: true,
  },
  {
    type: "select",
    label: "是否添加微信",
    value: "joinWeChatStatus",
    children: [
      {
        label: "未添加",
        value: "1"
      },
      {
        label: "已添加",
        value: "0"
      }
    ]
  },
  {
    type: "datePicker",
    label: "操作时间",
    value: "operate",
    props: {
      type: "date",
      "range-separator": "至",
      "start-placeholder": "开始日期",
      "end-placeholder": "结束日期",
      "value-format": "timestamp"
    }
  },
  {
    type: "cascader",
    label: "城市",
    value: "city",
    props: {
      expandTrigger: 'hover'
    },
    options: [
      {
        value: "zhinan",
        label: "指南",
        children: [
          {
            value: "shejiyuanze",
            label: "设计原则",
            children: [
              {
                value: "yizhi",
                label: "一致"
              },
              {
                value: "fankui",
                label: "反馈"
              },
              {
                value: "xiaolv",
                label: "效率"
              },
              {
                value: "kekong",
                label: "可控"
              }
            ]
          }
        ]
      }
    ]
  }
];

// 表格头设置
const columns = [
  {
    label: "姓名",
    prop: "name",
    props: {
      sortable: "sortable"
    }
  },
  {
    label: "性别",
    prop: "sex",
    formatter: (row, column, index) => {
      return row.sex === 0 ? "男" : "女";
    }
  },
  {
    label: "住址",
    prop: "address",
    newjump: (row, columns, index) => {
      return `/studentInfo/index/${row.accountId}`;
    }
  },
  {
    label: "手机号",
    render: (h, parmas) => {
      return [
        h("i", {
          class: "el-icon-phone-outline",
          style: "fontSize: 16px; color: red"
        }),
        h("span", parmas.row.mobileNum)
      ];
    }
  }
];

// 表格操作按钮
const operates = that => [
  {
    label: "编辑",
    isShow: row => {
      return row.status !== 2;
    },
    disabled: row => {
      return row.disabled === 2;
    },
    method: row => {
      that.handleNewJump(row);
    }
  }
];

// 服务器请求返回值
const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    sex: 0,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    sex: 1,
    disabled: 2,
    address: "西湖区湖底公园1号"
  }
];

// 表格扩展按钮
const extendButton = that => [
  {
    title: "批量导入",
    method: () => that.handleBatchCourse()
  }
];

export default {
  data() {
    return {
      columns,
      operates,
      dataSource,
      tableSearch,
      extendButton,
      formVal: {
        name: 18335
      },
      options: {
        index: true,
        labelIndex: "序号",
        pageExtend: {
         layout: 'total, sizes, ->, prev, pager, next, jumper'
        }
      },
      rules: {
        name: [{ required: true, message: "请填写学生ID", trigger: "blur" }]
      },
      pagination: {
        currentPage: 1,
        pageSize: 10
      }
    };
  },

  methods: {
    handleBatchCourse() {
      console.log("点击批量导入按钮");
    }
  }
};
</script>

<style lang="less" scoped>
.contaniner {
  margin-left: 230px;
}
</style>