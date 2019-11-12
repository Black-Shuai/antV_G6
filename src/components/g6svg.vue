<template>
  <el-container style="height: 100%;min-height: 100vh">
    <el-aside style="width:20%;border-style: solid">
      <button style="margin: 16px;padding: 3%" id="addCircle">添加节点</button>
      <button style="margin: 16px;padding: 3%" id="drag">连线模式</button>
      <button style="margin: 16px;padding: 3%" id="edit">编辑模式</button><!--编辑模式只实现节点的连线-->
    </el-aside>
    <el-main style="border-style: solid">
      <div id="mountNode"></div>
    </el-main>
    <ul id="tcontextMenu" style="display: none;list-style: none">
      <li><el-button type="primary" plain id="editNode">编辑</el-button></li>
      <li><el-button type="primary" plain id="deleteNode">删除</el-button></li>
    </ul>
<!--    节点编辑对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form style="text-align: center">
        <el-form-item label="节点id">
          <el-input v-model="nodeid" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="节点标签">
          <el-input v-model="nodeLabel" style="width: 150px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </el-container>
</template>

<script>
import G6 from '@antv/g6'
import $ from 'jquery'
export default {
  name: 'g6svg',
  data () {
    return {
      dialogVisible: false,
      nodeid: '',
      nodeLabel: '',
      i: 2,
      edg: {
        source: '',
        target: ''
      },
      testData: {
        nodes: [{
          id: 'node1',
          label: 'P1',
          x: 200,
          y: 200
        }],
        edges: []}
    }
  },
  created () { // 不能在created方法中初始化
    // this.initG6()
  },
  mounted () {
    this.initG6()
    this.getmes()
  },
  methods: {
    handleClose (done) {
      done()
    },
    getmes () {
      console.log('初始化成功')
    },
    initG6: function () {
      const data = this.testData
      var noid = ''
      const graph = new G6.Graph({
        container: 'mountNode', // 设置节点所在容器
        width: window.innerWidth, // 将画布宽高设置成动态
        height: window.innerHeight,
        mode: 'edit',
        // 节点在默认状态下的样式配置（style）和其他配置
        defaultNode: {
          labelCfg: {
            style: {
              fill: '#fff', // 标签字体颜色
              fontSize: 18 // 标签字体大小
            }
          },
          size: 50, // 节点大小
          // 节点样式配置
          style: {
            fill: 'steelblue', // 节点填充色
            stroke: '#666', // 节点描边色
            lineWidth: 3 // 节点描边粗细
          }
        },
        modes: {
          default: ['click-add-edge', 'click-select', 'drag-node'], //  添加连线、点击选中
          edit: ['zoom-canvas', 'drag-canvas', 'drag-node'] // 画布缩放、画布拖拽
        }
      })
      graph.read(data)
      graph.render()
      // 添加边
      G6.registerBehavior('click-add-edge', {
        getEvents () {
          return {
            'node:click': 'onClick',
            mousemove: 'onMousemove',
            'edge:click': 'onEdgeClick' // 点击空白处，取消边
          }
        },
        onClick (ev) {
          const node = ev.item
          const graph = this.graph
          const point = {
            x: ev.x,
            y: ev.y
          }
          const model = node.getModel()
          if (this.addingEdge && this.edge) {
            graph.updateItem(this.edge, {
              target: model.id
            })
            // graph.setItemState(this.edge, 'selected', true);
            this.edge = null
            this.addingEdge = false
          } else {
            this.edge = graph.addItem('edge', {
              source: model.id,
              target: point
            })
            this.addingEdge = true
          }
        },
        onMousemove (ev) {
          const point = {
            x: ev.x,
            y: ev.y
          }
          if (this.addingEdge && this.edge) {
            this.graph.updateItem(this.edge, {
              target: point,
              shape: 'line-arrow'
            })
          }
        },
        onEdgeClick (ev) {
          const currentEdge = ev.item
          // 拖拽过程中，点击会点击到新增的边上
          if (this.addingEdge && this.edge === currentEdge) {
            graph.removeItem(this.edge)
            this.edge = null
            this.addingEdge = false
          }
        }
      })
      // 自定义连线的样式
      G6.registerEdge('line-arrow', {
        itemType: 'edge',
        draw: function draw (cfg, group) {
          // eslint-disable-next-line one-var
          var startPoint = cfg.startPoint,
            endPoint = cfg.endPoint

          var keyShape = group.addShape('path', {
            attrs: {
              path: [['M', startPoint.x, startPoint.y], ['L', endPoint.x, endPoint.y]],
              stroke: '#3c84a7',
              lineWidth: 1,
              endArrow: true
            }
          })
          return keyShape
        }
      })
      // 添加节点
      $('#addCircle').on('click', () => { // 添加圆形节点,这个报错是因为ESLint的原因
        graph.add('node', {
          shape: 'circle',
          id: 'node' + this.i++,
          label: 'P' + this.i,
          x: 50 + this.i * 10,
          y: 50 + this.i * 10
        })
        graph.refresh()
      })
      $('#deleteNode').on('click', () => {
        const item = graph.findById(noid)
        graph.removeItem(item)
        menu.style.display = 'none'
      })
      $('#editNode').on('click', () => {
        const item = graph.findById(noid)
        console.log(item)
        menu.style.display = 'none'
        this.dialogVisible = true
        this.nodeid = item.getModel().id
        this.nodeLabel = item.getModel().label
      })
      $('#drag').on('click', () => { // 拖拽模式
        graph.setMode('default')
        console.log('拖拽模式')
      })
      $('#edit').on('click', () => { // 编辑模式
        graph.setMode('edit')
        console.log('编辑模式')
      })
      $('#addedge').on('click', () => { // 添加边
        graph.setMode('addedge')
        console.log('添加边')
      })
      // 右击事件显示菜单
      var menu = document.getElementById('tcontextMenu')
      graph.on('node:contextmenu', function (evt) {
        noid = evt.item._cfg.id
        console.log(noid)
        menu.style.position = 'absolute' // 这里必须设置位置定位
        menu.style.left = evt.clientX + 'px'
        menu.style.top = evt.clientY + 'px'
        menu.style.display = 'block' // 菜单显示
      })
      // graph.on('node:mouseleave', function (evt) {
      //   menu.style.display = 'none' // 菜单隐藏
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
