<template>
  <el-container style="height: 100%;min-height: 100vh">
    <el-aside style="width:20%;border-style: solid">
      <button style="margin: 16px;padding: 3%" id="addCircle">添加节点</button>
      <button style="margin: 16px;padding: 3%" id="drag">拖拽模式</button>
      <button style="margin: 16px;padding: 3%" id="edit">编辑模式</button>
    </el-aside>
    <el-main style="border-style: solid">
      <div id="mountNode"></div>
    </el-main>
  </el-container>
</template>

<script>
import G6 from '@antv/g6'
import $ from 'jquery'
export default {
  name: 'g6svg',
  data () {
    return {
      edg: {
        source: '',
        target: ''
      },
      i: 4,
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
    getmes () {
      console.log('初始化成功')
    },
    initG6: function () {
      const data = this.testData
      const graph = new G6.Graph({
        container: 'mountNode', // 设置节点所在容器
        width: window.innerWidth, // 将画布宽高设置成动态
        height: window.innerHeight,
        mode: 'edit',
        // 节点在默认状态下的样式配置（style）和其他配置
        defaultNode: {
          size: 40, // 节点大小
          // 节点样式配置
          style: {
            fill: 'steelblue', // 节点填充色
            stroke: '#666', // 节点描边色
            lineWidth: 1 // 节点描边粗细
          }
        },
        modes: {
          default: ['click-add-edge', 'click-select', 'drag-node', 'drag-canvas'], // 节点拖拽、画布拖拽、添加连线、点击选中
          edit: ['zoom-canvas', 'drag-canvas'] // 画布缩放、画布拖拽
        }
      })
      graph.read(data)
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
              endArrow: {
                path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
                d: 6
              }
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
          label: 'P' + this.i++,
          x: 50 + this.i * 10,
          y: 50 + this.i * 10
        })
        graph.refresh()
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
