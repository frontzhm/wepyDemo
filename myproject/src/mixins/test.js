import wepy from 'wepy'

export default class testMixin extends wepy.mixin {
  data = {
    mixin: 'This is mixin data.'
  }
  methods = {
    tap () {
      this.mixin = 'mixin data was changed'
      console.log('mixin method tap')
    }
  }

  countDown (opt) {
    let defaultData = { init: 3, key: 'codeBtnText', endText: '重新获取' }
    let {init, key, endText} = opt ? Object.assign(defaultData, opt) : defaultData
    let timer = setInterval(() => {
      if (init <= 0) {
        clearTimeout(timer)
        this[key] = endText
        this.$apply()
        return
      }
      init--
      this[key] = init + 's'
      this.$apply()
    }, 1000)
  }

  onShow () {
    console.log('mixin onShow')
  }

  onLoad () {
    console.log('mixin onLoad')
  }
}
