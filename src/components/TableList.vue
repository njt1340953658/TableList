/**
 * Table表格
 */
<template>
  <div class="table_list_fix">
    <!-- 扩展性内容 -->
    <slot name="content_context"></slot>

    <!-- table中间button eg:导出 -->
    <div v-if="exportBut && exportBut.length > 0" class="btn-operates">
      <a
        :key="index"
        :href="item.href || null"
        @click="item.method()"
        v-for="(item, index) in exportBut"
      >
        <el-button type="primary">{{item.title}}</el-button>
      </a>
    </div>

    <!-- table表格 -->
    <el-table
      size="small"
      v-bind="options"
      :border="border"
      :data="dataSource"
      v-loading="loading"
      v-on="tableEvents"
      ref="multipleTable"
      style="width: 100%;"
      :header-cell-style="{ background: '#f6f2ee' }"
      @selection-change="handleSelectionChange"
    >
      <!-- 复选框 -->
      <el-table-column
        type="selection"
        style="width: 55px;"
        v-if="options && options.selection && (!options.isShow || options.isShow()) "
      />

      <el-table-column
        width="60"
        align="center"
        type="index"
        v-if="options && options.index"
        :label="options && options.labelIndex"
      />

      <!-- 表格数据 -->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="index"
          v-bind="column.props"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :width="column.width"
          v-if="!column.isShow || (column.isShow && column.isShow())"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="column.formatter">
                <span
                  v-html="column.formatter(scope.row, column, scope.$index)"
                  @click="column.click && column.click(scope.row, scope.$index)"
                ></span>
              </template>
              <template v-else-if="column.newjump">
                <router-link
                  class="newjump"
                  v-bind="{ target : '_blank', ...column.target }"
                  :to="column.newjump(scope.row, column, scope.$index)"
                >{{scope.row[column.prop] || column.content}}</router-link>
              </template>
              <template v-else>
                <span
                  :style="column.click ? 'color: #409EFF; cursor: pointer;' : null"
                  @click="column.click && column.click(scope.row, scope.$index)"
                >
                  {{scope.row[column.prop] || column.content}}
                  {{`${scope.row[column.prop] && column.unit ? column.unit : ''}`}}
                </span>
              </template>
            </template>
            <template v-else>
              <render :column="column" :row="scope.row" :render="column.render" :index="index"></render>
            </template>
          </template>
        </el-table-column>
      </template>

      <!-- slot插槽按钮 -->
      <el-table-column label="操作" align="center" v-if="options && options.slotcontent">
        <template slot-scope="scope">
          <slot :data="scope.row"></slot>
        </template>
      </el-table-column>

      <!-- 操作按钮 -->
      <el-table-column
        label="操作"
        align="center"
        v-bind="options && options.props"
        v-if="operates && operates.length > 0"
      >
        <template slot-scope="scope">
          <div class="operate-group">
            <template v-for="(btn, key) in operates">
              <span
                :key="key"
                v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))"
              >
                <el-button
                  :size="btn.size || 'small'"
                  :type="btn.type || `text`"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  :disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
                  @click.native.prevent="btn.method(scope.row, scope.$index)"
                >{{ btn.label }}{{operates.length >= 2 ? '&nbsp;&nbsp;' : ''}}</el-button>
              </span>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <!-- 分页部分 -->
    <el-pagination
      background
      class="pagination"
      v-if="pagination"
      :total="dataTotal"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @current-change="handleChangePage"
      layout="total, prev, pager, next"
    />
  </div>
</template>

<script>
let methods = {
  // 复选框选中项
  handleSelectionChange(val) {
    this.multipleSelection = val;
    this.$emit("handleSelectionChange", Array.from(val));
  },

  // 改变分页触发事件
  handleChangePage(val) {
    this.$emit("handleChangePage", val);
  }
};

export default {
  name: "TableList",
  props: {
    dataSource: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    },
    border: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    slotcontent: {
      type: Boolean,
      default: false
    },
    operates: {
      type: Array
    },
    pagination: {
      type: Object,
      default: null
    },
    dataTotal: {
      type: Number,
      default: 0
    },
    exportBut: {
      type: Array
    },
    options: Object,
    tableEvents: Object
  },

  data() {
    return {
      multipleSelection: []
    };
  },

  methods,

  mounted() {
    this.$nextTick(() => {
      this.$emit("toggleRowSelection", this.$refs.multipleTable);
    });
  },

  components: {
    render: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, opt) => {
        const params = {
          row: opt.props.row,
          index: opt.props.index
        };
        if (opt.props.column) params.column = opt.props.column;
        return opt.props.render(h, params);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.table_list_fix {
  overflow: hidden;
  .btn-operates {
    margin-bottom: 6px;
    a {
      color: #fff;
      text-decoration: none;
      display: inline-block;
    }
  }
}
.table-header {
  padding-top: 10px;
  .table-header_button {
    text-align: right;
    float: right;
    margin-bottom: 12px;
    line-height: 40px;
  }
}
.newjump {
  text-decoration: none;
  color: dodgerblue;
}

.pagination {
  text-align: center;
}
</style>
