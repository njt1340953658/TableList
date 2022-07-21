/* * 列表查询组件 */
<template>
  <div class="table-form-container_content">
    <!-- form表单 -->
    <div class="table-header" v-if="!isLayout && search && search.length > 0">
      <el-form
        size="small"
        :rules="rules"
        :model="formSearch"
        :inline="true"
        ref="formSearch"
        label-position="right"
        v-bind="{ 'label-width': '130px', ...(options && options.formProps) }"
      >
        <el-form-item
          :key="index"
          :prop="item.value"
          class="table-header-item"
          :label="item.label + '：'"
          v-bind="item.labelProps"
          v-for="(item, index) in search"
        >
          <el-select
            clearable
            v-bind="item.props"
            v-if="item.type === 'select'"
            v-model="formSearch[item.value]"
            :placeholder="`请选择${item.placeholder || item.label}`"
          >
            <el-option
              v-for="option in item.children"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
          <el-date-picker
            clearable
            style="width: 100%"
            placeholder="选择日期"
            v-model="formSearch[item.value]"
            v-else-if="item.type === 'picker'"
            v-bind="item.props || { type: 'date' }"
          />
          <el-cascader
            clearable
            v-bind="item.props"
            :options="item.options"
            v-model="formSearch[item.value]"
            v-else-if="item.type === 'cascader'"
            :placeholder="`请输入${item.placeholder || item.label}`"
          ></el-cascader>
          <el-input
            v-else
            clearable
            v-bind="item.props"
            :type="item.inputType || 'text'"
            v-model="formSearch[item.value]"
            :placeholder="`请输入${item.placeholder || item.label}`"
            :maxlength="item.maxlength"
            @keyup.enter.native="handleSearch"
            :oninput="handleChangeInput(item)"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
            >查询</el-button
          >
          <el-button
            plain
            size="small"
            icon="el-icon-refresh-right"
            @click="handleReset('formSearch')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20" v-if="isLayout && search && search.length > 0">
      <el-form
        size="small"
        :rules="rules"
        :model="formSearch"
        ref="formSearch"
        v-bind="{ 'label-width': '130px', ...(options && options.formProps) }"
      >
        <el-col :lg="12" :xl="8" :key="index" v-for="(item, index) in search">
          <el-form-item
            :label="item.label + '：'"
            :prop="item.value"
            v-bind="item.labelProps"
          >
            <el-select
              clearable
              style="width: 100%"
              v-bind="item.props"
              v-if="item.type === 'select'"
              v-model="formSearch[item.value]"
              :placeholder="`请选择${item.placeholder || item.label}`"
            >
              <el-option
                v-for="option in item.children"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </el-select>
            <el-date-picker
              clearable
              style="width: 100%"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-bind="item.props || { type: 'date' }"
              v-else-if="item.type === 'picker'"
              v-model="formSearch[item.value]"
            />
            <el-cascader
              clearable
              style="width: 100%"
              v-bind="item.props"
              :options="item.options"
              v-model="formSearch[item.value]"
              v-else-if="item.type === 'cascader'"
              :placeholder="`请输入${item.placeholder || item.label}`"
            ></el-cascader>
            <el-row
              type="flex"
              :gutter="5"
              v-else-if="item.type === 'datePicker'"
            >
              <el-col :span="12">
                <el-date-picker
                  clearable
                  style="width: 100%"
                  :editable="false"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  v-bind="item.props || { type: 'date' }"
                  v-model="formSearch[item.startDate]"
                  :picker-options="startPickerOptions(formSearch[item.endDate])"
                >
                </el-date-picker>
              </el-col>
              <el-col :span="12">
                <el-date-picker
                  clearable
                  :editable="false"
                  style="width: 100%"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  v-bind="item.props || { type: 'date' }"
                  v-model="formSearch[item.endDate]"
                  :picker-options="endPickerOptions(formSearch[item.startDate])"
                >
                </el-date-picker>
              </el-col>
            </el-row>
            <el-input
              v-else
              clearable
              v-bind="item.props"
              :type="item.inputType || 'text'"
              v-model="formSearch[item.value]"
              :placeholder="`请输入${item.placeholder || item.label}`"
              :maxlength="item.maxlength"
              @keyup.enter.native="handleSearch"
              :oninput="handleChangeInput(item)"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item label-width="0">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
              >查询</el-button
            >
            <el-button
              icon="el-icon-refresh-left"
              @click="handleReset('formSearch')"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 扩展性内容 -->
    <slot name="content_context"></slot>

    <!-- table中间button eg:导出 -->
    <div v-if="extendButton && extendButton.length > 0" class="btn-operates">
      <a
        :key="index"
        :href="item.href || null"
        v-for="(item, index) in extendButton"
        @click="item.method()"
      >
        <el-button size="small" type="primary">{{ item.title }}</el-button>
      </a>
    </div>

    <!-- table表格 -->
    <el-table
      size="small"
      :border="border"
      style="width: 100%"
      :data="dataSource"
      v-loading="loading"
      v-on="tableEvents"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-bind="{ 'header-cell-style': { background: '#F5F7FA' }, ...options }"
    >
      <!-- 复选框 -->
      <el-table-column
        type="selection"
        style="width: 55px"
        v-if="
          options && options.selection && (!options.isShow || options.isShow())
        "
      />
      <!-- 序号 -->
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
                  type="primary"
                  :underline="false"
                  v-bind="{ target: '_blank', ...column.target }"
                  :to="column.newjump(scope.row, column, scope.$index)"
                  >{{ scope.row[column.prop] || column.content }}</router-link
                >
              </template>
              <template v-else>
                <span
                  :style="
                    column.click ? 'color: #409EFF; cursor: pointer;' : null
                  "
                  @click="column.click && column.click(scope.row, scope.$index)"
                >
                  {{ scope.row[column.prop] || column.content }}
                  {{
                    `${
                      scope.row[column.prop] && column.unit ? column.unit : ""
                    }`
                  }}
                </span>
              </template>
            </template>
            <template v-else>
              <render
                :column="column"
                :row="scope.row"
                :render="column.render"
                :index="index"
              ></render>
            </template>
          </template>
        </el-table-column>
      </template>

      <!-- slot插槽按钮 -->
      <el-table-column
        label="操作"
        align="center"
        v-if="options && options.slotcontent"
      >
        <template slot-scope="scope">
          <slot :index="scope.index" :data="scope.row"></slot>
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
                v-if="
                  !btn.isShow ||
                  (btn.isShow && btn.isShow(scope.row, scope.$index))
                "
              >
                <template v-if="btn.render">
                  <render
                    :column="scope.row"
                    :row="scope.row"
                    :render="btn.render"
                    :index="scope.$index"
                  ></render>
                </template>
                <template v-if="!btn.render">
                  <el-button
                    :size="btn.size || 'small'"
                    :type="btn.type || `text`"
                    :icon="btn.icon"
                    :plain="btn.plain"
                    :style="
                      btn.setStyle && btn.setStyle(scope.row, scope.$index)
                    "
                    v-bind="btn.props"
                    @click.native.prevent="btn.method(scope.row, scope.$index)"
                    :disabled="
                      btn.disabled && btn.disabled(scope.row, scope.$index)
                    "
                  >
                    {{ btn.label
                    }}{{ operates.length >= 2 ? "&nbsp;&nbsp;" : "" }}
                  </el-button>
                </template>
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
      v-if="pagination"
      :total="dataTotal"
      :page-sizes="[5, 10, 20, 30, 50, 100]"
      :page-size="pagination.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleChangePage"
      :current-page="pagination.currentPage"
      v-on="options && options.handlePageEvent"
      :class="options && options.pageExtend ? '' : 'pagination'"
      v-bind="{ layout: 'total, prev, pager, next', ...options && options.pageExtend }"
    />
  </div>
</template>

<script>
import { convertParams } from "./util/utilTool";

const methods = {
  // 复选框选中项
  handleSelectionChange(val) {
    this.multipleSelection = val;
    this.$emit("handleSelectionChange", Array.from(val));
  },

  // 改变分页触发事件
  handleChangePage(val) {
    this.$emit('current-change', val);
  },

  handleSizeChange(page) {
    this.$emit('size-change', page);
  },

  // 搜索查询按钮
  handleSearch() {
    if (this.rules) {
      return this.$refs["formSearch"].validate((valid) => {
        if (!valid) return false;
        this.$emit(
          "handleSearch",
          convertParams(Object.assign({}, this.formSearch))
        );
      });
    }
    this.$emit(
      "handleSearch",
      convertParams(Object.assign({}, this.formSearch))
    );
  },

  // 搜索重置按钮
  handleReset(formName) {
    this.$refs[formName].resetFields();
    this.formSearch = this.reset ? { ...this.value } : {};
    this.$emit("handleReset");
    if (this.reset) return false;
    this.handleSearch();
  },

  // input为number校验
  handleChangeInput(item) {
    return item.inputType === "number"
      ? this.handleOnInput(
          this.formSearch[item.value],
          item.value,
          item.rulesLength
        )
      : null;
  },

  // input渲染长度校验
  handleOnInput(val, label, rulesLength, maxlength = 11) {
    if (val && Number(val) <= 0) {
      this.formSearch[label] = 0;
    }
    if (rulesLength && val && val.length > maxlength) {
      this.formSearch[label] = this.formSearch[label].slice(0, maxlength);
    }
  },
};

export default {
  name: "TableList",
  props: {
    search: {
      type: Array,
    },
    isLayout: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: Object,
    },
    value: {
      type: Object,
    },
    reset: {
      type: Boolean,
    },
    dataSource: {
      type: Array,
      default: [],
    },
    columns: {
      type: Array,
      default: [],
    },
    border: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    slotcontent: {
      type: Boolean,
      default: false,
    },
    operates: {
      type: Array,
    },
    pagination: {
      type: Object,
      default: null,
    },
    dataTotal: {
      type: Number,
      default: 0,
    },
    extendButton: {
      type: Array,
    },
    options: Object,
    tableEvents: Object,
  },

  data() {
    return {
      formSearch: {},
      multipleSelection: [],
    };
  },

  mounted() {
    this.formSearch = { ...this.value };
    this.$nextTick(() => {
      this.$emit("toggleRowSelection", this.$refs.multipleTable);
    });
  },

  methods,

  watch: {
    value(val) {
      if (val) return (this.formSearch = { ...this.value });
    },
  },

  computed: {
    startPickerOptions() {
      return function (value) {
        return {
          disabledDate: (time) => {
            const endDateVal = new Date(value).getTime();
            if (endDateVal) {
              return time.getTime() > endDateVal;
            }
          },
        };
      };
    },
    endPickerOptions() {
      return function (value) {
        return {
          disabledDate: (time) => {
            const startDateVal = new Date(value).getTime();
            if (startDateVal) {
              return time.getTime() < beginDateVal - 8.64e7 + 1;
            }
          },
        };
      };
    },
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
          default: null,
        },
      },
      render: (h, opt) => {
        const params = {
          row: opt.props.row,
          index: opt.props.index,
        };
        if (opt.props.column) params.column = opt.props.column;
        return opt.props.render(h, params);
      },
    },
  },
};
</script>

<style lang="less">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<style lang="less" scoped>
.table-form-container_content {
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
  .table-header-item .el-form-item {
    width: 100%;
    display: flex;
    flex: auto;
    margin-bottom: 12px;
    .el-form-item__content,
    .el-select {
      width: 100%;
    }
  }
}
.newjump {
  font-size: 12px;
  text-decoration: none;
  color: dodgerblue;
}

.pagination {
  text-align: end;
  padding-bottom: 15px;
}
</style>