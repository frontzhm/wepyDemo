# wepyDemo

wepydemo

[wepy文档](https://tencent.github.io/wepy/document.html#/)

## 命令

`wepy => ./node_modules/.bin/wepy`

```bash
npm install wepy-cli --save-dev

wepy new myproject

cd myproject

wepy build --watch
```

## 重要提醒

* dist是小程序工具选择的目录,且需要开启保存自动编译
* 小程序工具设置项目-->关闭ES6转ES5/关闭上传代码时样式自动补全/关闭代码压缩上传。

## 编辑器显示代码高亮

vscode => 在 Code 里先安装 Vue 的语法高亮插件 Vetur => 打开任意的.wpy文件 => 点击右下角的"纯文本" => 在弹出的窗口中选择 .wpy 的配置文件关联... => 选择要与 .wpy 关联的语言模式 中选择 Vue。

## 代码的规范和一些默认规则

1. 变量与方法尽量使用驼峰式命名，并且注意避免使用$开头。 以$开头的标识符为WePY框架的内建属性和方法，可在JavaScript脚本中以this.的方式直接使用，具体请参考API文档。
2. 小程序入口、页面、组件文件名的后缀为.wpy；外链的文件可以是其它后缀。 具体请参考wpy文件说明。
3. 使用ES6语法开发。 
4. 使用Promise。 框架默认对小程序提供的API全都进行了 Promise 处理，甚至可以直接使用async/await等新特性进行开发（注意：WePY 1.4.1以后的版本默认不支持async/await语法，因为可能导致iOS 10.0.1崩溃，如果不在意该问题可手动开启，具体可参看这里）。
5. 事件绑定语法使用优化语法代替。 原bindtap="click"替换为@tap="click"，原catchtap="click"替换为@tap.stop="click"。更多@符用法，参见组件自定义事件。
6. 事件传参使用优化后语法代替。 原bindtap="click" data-index={{index}}替换为@tap="click({{index}})"。
7. 自定义组件命名应避开微信原生组件名称以及功能标签<repeat>。 不可以使用input、button、view、repeat等微信小程序原生组件名称命名自定义组件；另外也不要使用WePY框架定义的辅助标签repeat命名。有关repeat的详细信息，请参见循环列表组件引用。

## 主要功能特性

* 开发模式的转换: js里 拆分为 data,methods,周期函数

```js
// 原生小程序
//index.js

//获取应用实例
var app = getApp()

//通过Page构造函数创建页面逻辑
Page({
    //可用于页面模板绑定的数据
    data: {
        motto: 'Hello World',
        userInfo: {}
    },

    //事件处理函数
    bindViewTap: function() {
        console.log('button clicked')
    },

    //页面的生命周期函数
    onLoad: function () {
        console.log('onLoad')
    }
})
//index.wpy中的<script>部分

import wepy from 'wepy';

//通过继承自wepy.page的类创建页面逻辑
export default class Index extends wepy.page {
    //可用于页面模板绑定的数据
    data = {
        motto: 'Hello World',
        userInfo: {}
    };

    //事件处理函数(集中保存在methods对象中)
    methods = {
        bindViewTap () {
            console.log('button clicked');
        }
    };

    //页面的生命周期函数
    onLoad() {
        console.log('onLoad');
    };
}
```

* 支持组件化开发

```html
// index.wpy

<template>
    <view>
        <panel>
            <h1 slot="title"></h1>
        </panel>
        <counter1 :num="myNum"></counter1>
        <counter2 :num.sync="syncNum"></counter2>
        <list :item="items"></list>
    </view>
</template>

<script>
import wepy from 'wepy';
//引入List、Panel和Counter组件
import List from '../components/list';
import Panel from '../components/panel';
import Counter from '../components/counter';

export default class Index extends wepy.page {
    //页面配置
    config = {
        "navigationBarTitleText": "test"
    };

    //声明页面中将要使用到的组件
    components = {
        panel: Panel,
        counter1: Counter,
        counter2: Counter,
        list: List
    };

    //可用于页面模板中绑定的数据
    data = {
        myNum: 50,
        syncNum: 100,
        items: [1, 2, 3, 4]
    }
}
</script>
```

* 支持加载外部NPM包
* 单文件模式，目录结构更清晰，开发更方便
* 默认使用babel编译，支持ES6/7的一些新特性
* 针对原生API进行优化

## 创建app page component mixin

### app实例

```js
import wepy from 'wepy';

export default class MyAPP extends wepy.app {
    customData = {};

    customFunction ()　{ }

    onLaunch () {}

    onShow () {}

    config = {}  // 对应 app.json 文件

    globalData = {}
}
```

### page实例或者component实例

在Page页面实例中，可以通过this.$parent来访问App实例。
注意，对于WePY中的methods属性，因为与Vue中的使用习惯不一致，非常容易造成误解，这里需要特别强调一下：WePY中的methods属性只能声明页面wxml标签的bind、catch事件，不能声明自定义方法，这与Vue中的用法是不一致的。

```js
import wepy from 'wepy';

export default class MyPage extends wepy.page {
// export default class MyComponent extends wepy.component {
    customData = {}  // 自定义数据

    customFunction ()　{}  //自定义方法

    onLoad () {}  // 在Page和Component共用的生命周期函数

    onShow () {}  // 只在Page中存在的页面生命周期函数

    config = {};  // 只在Page实例中存在的配置数据，对应于原生的page.json文件

    data = {};  // 页面所需数据均需在这里声明，可用于模板数据绑定

    components = {};  // 声明页面中所引用的组件，或声明组件中所引用的子组件

    mixins = [];  // 声明页面所引用的Mixin实例

    computed = {};  // 声明计算属性（详见后文介绍）

    watch = {};  // 声明数据watcher（详见后文介绍）

    methods = {};  // 声明页面wxml中标签的事件处理函数。注意，此处只用于声明页面wxml中标签的bind、catch事件，自定义方法需以自定义方法的方式声明

    events = {};  // 声明组件之间的事件处理函数
}
```

### 组件和components增加的功能

#### for

```html
<!-- // index.wpy -->
<template>
    <!-- 注意，使用for属性，而不是使用wx:for属性 -->
    <repeat for="{{list}}" key="index" index="index" item="item">
        <!-- 插入<script>脚本部分所声明的child组件，同时传入item -->
        <child :item="item"></child>
    </repeat>
</template>

```

#### computed

```js
  data = {
      a: 1
  }

  // 计算属性aPlus，在脚本中可通过this.aPlus来引用，在模板中可通过{{ aPlus }}来插值
  computed = {
      aPlus () {
          return this.a + 1
      }
  }
```

#### watcher监听器适用于当数值属性改变时需要进行某些额外处理的情形。

```js
  data = {
      num: 1
  }

  // 监听器函数名必须跟需要被监听的data对象中的数值属性num同名，
  // 其参数中的newValue为数值属性改变后的新值，oldValue为改变前的旧值
  watch = {
      num (newValue, oldValue) {
          console.log(`num value: ${oldValue} -> ${newValue}`)
      }
  }

  // 每当被监听的数值属性num改变一次，对应的同名监听器函数num()就被自动调用执行一次
  onLoad () {
      setInterval(() => {
          this.num++;
          this.$apply();
      }, 1000)
  }
```

#### props

props传值,有静态传值和动态传值,其中还有父组件向子组件传值 和 子组件向父组件传值
静态传值只有字符串.只等于父组件第一次传值,父组件再改变时,与其无关
sync动态传值,父组件改变与其有关,且可以是别的类型.
twoWay属性为true的时候,子组件的值改变会让父组件的值相应改变.也就是改变twoWayTitle就是改变父组件的parentTitle

子组件还可以通过this.$parent.parentTitle = 'p-title-changed';直接改变父组件的值

```js
// parent.wpy

<child :title="parentTitle" :syncTitle.sync="parentTitle" :twoWayTitle="parentTitle"></child>

data = {
    parentTitle: 'p-title'
};


// child.wpy

props = {
    // 静态传值
    title: String,

    // 父向子单向动态传值
    syncTitle: {
        type: String,
        default: 'null'
    },

    twoWayTitle: {
        type: Number,
        default: 50,
        twoWay: true
    }
};

onLoad () {
    console.log(this.title); // p-title
    console.log(this.syncTitle); // p-title
    console.log(this.twoWayTitle); // 50

    this.title = 'c-title';
    console.log(this.$parent.parentTitle); // p-title.
    this.twoWayTitle = 60;
    this.$apply();
    console.log(this.$parent.parentTitle); // 60.  --- twoWay为true时，子组件props中的属性值改变时，会同时改变父组件对应的值
    this.$parent.parentTitle = 'p-title-changed';
    this.$parent.$apply();
    console.log(this.title); // 'p-title';
    console.log(this.syncTitle); // 'p-title-changed' --- 有.sync修饰符的props属性值，当在父组件中改变时，会同时改变子组件对应的值。
}
```

#### 组件间的通信

wepy.component基类提供$broadcast、$emit、$invoke三个方法用于组件之间的通信和交互，

父子关系的 $broadcast、$emit
非父子关系的 $invoke

用于监听组件之间的通信与交互事件的事件处理函数需要写在组件和页面的events对象中，如：

```js
import wepy from 'wepy'

export default class Com extends wepy.component {
    components = {};

    data = {};

    methods = {};

    // events对象中所声明的函数为用于监听组件之间的通信与交互事件的事件处理函数
    events = {
        'some-event': (p1, p2, p3, $event) => {
               console.log(`${this.name} receive ${$event.name} from ${$event.source.name}`);
        }
    };
    // Other properties
}
```

$broadcast事件是由父组件发起，所有子组件都会收到此广播事件，除非事件被手动取消。
$emit与$broadcast正好相反，事件发起组件的所有祖先组件会依次接收到$emit事件。
$invoke是一个页面或组件对另一个组件中的方法的直接调用，通过传入组件路径找到相应的组件，然后再调用其方法。

```js
this.$invoke('./../ComB/ComG', 'someMethod', 'someArgs');
```

#### 组件自定义事件处理函数

可以通过使用.user修饰符为自定义组件绑定事件，如：@customEvent.user="myFn"

其中，@表示事件修饰符，customEvent 表示事件名称，.user表示事件后缀。

目前总共有三种事件后缀：

.default: 绑定小程序冒泡型事件，如bindtap，.default后缀可省略不写；

.stop: 绑定小程序捕获型事，如catchtap；

.user: 绑定用户自定义组件事件，通过$emit触发。

```html
<!-- // index.wpy -->

<template>
    <child @childFn.user="parentFn"></child>
</template>

<script>
    import wepy from 'wepy'
    import Child from '../components/child'

    export default class Index extends wepy.page {
        components = {
            child: Child
        }

        methods = {
            parentFn (num, evt) {
                console.log('parent received emit event, number is: ' + num)
            }
        }
    }
</script>


// child.wpy

<template>
    <view @tap="tap">Click me</view>
</template>

<script>
    import wepy from 'wepy'

    export default class Child extends wepy.component {
        methods = {
            tap () {
                console.log('child is clicked')
                this.$emit('childFn', 100)
            }
        }
    }
</script>
```

#### 混合mixin

默认式混合和兼容式混合

默认式混合
对于组件data数据，components组件，events事件以及其它自定义方法采用默认式混合，即如果组件未声明该数据，组件，事件，自定义方法等，那么将混合对象中的选项将注入组件这中。对于组件已声明的选项将不受影响。

```js
// mixins/test.js
import wepy from 'wepy';

export default class TestMixin extends wepy.mixin {
    data = {
        foo: 'foo defined by page',
        bar: 'bar defined by testMix'
    };
    methods: {
    tap () {
      console.log('mix tap');
    }
  }
}

// pages/index.wpy
import wepy from 'wepy';
import TestMixin from './mixins/test';

export default class Index extends wepy.page {
    data = {
        foo: 'foo defined by index'
    };
    mixins = [TestMixin ];
    onShow() {
        console.log(this.foo); // foo defined by index.
        console.log(this.bar); // foo defined by testMix.
    }
}
```

兼容式混合
对于组件methods响应事件，以及小程序页面事件将采用兼容式混合，即先响应组件本身响应事件，然后再响应混合对象中响应事件。  

```js
// mixins/test.js
import wepy from 'wepy';

export default class TestMixin extends wepy.mixin {
    methods = {
        tap () {
            console.log('mix tap');
        }
    };
    onShow() {
        console.log('mix onshow');
    }
}

// pages/index.wpy
import wepy from 'wepy';
import TestMixin from './mixins/test';

export default class Index extends wepy.page {

    mixins = [TestMixin];
    methods = {
        tap () {
            console.log('index tap');
        }
    };
    onShow() {
        console.log('index onshow');
    }
}


// index onshow
// mix onshow
// ----- when tap
// index tap
// mix tap
```

#### 数据绑定

```js
// 小程序
this.setData({title: 'this is title'});

// wepy
this.title = 'this is title';
// 在函数运行周期之外的函数里去修改数据需要手动调用$apply方法
this.$apply();

```

## 优化小程序的接口

### wx.request 接收参数修改

```js
// 官方
wx.request({
    url: 'xxx',
    success: function (data) {
        console.log(data);
    }
});

// WePY 使用方式
wepy.request('xxxx').then((d) => console.log(d));
```

### 优化事件参数接口 

```js
// 官方
<view data-id="{{index}}" data-title="wepy" data-other="otherparams" bindtap="tapName"> Click me! </view>
Page({
  tapName: function(event) {
    console.log(event.currentTarget.dataset.id)// output: 1
    console.log(event.currentTarget.dataset.title)// output: wepy
    console.log(event.currentTarget.dataset.other)// output: otherparams
  }
});

// WePY 1.1.8以后的版本，只允许传string。
<view bindtap="tapName({{index}}, 'wepy', 'otherparams')"> Click me! </view>

methods: {
    tapName (id, title, other, event) {
        console.log(id, title, other)// output: 1, wepy, otherparams
    }
}
```

### 改变数据绑定方式

保留setData方法，但不建议使用setData执行绑定，修复传入undefined的bug，并且修改入参支持： this.setData(target, value) this.setData(object)

```js
// 官方
<view> {{ message }} </view>

onLoad: function () {
    this.setData({message: 'hello world'});
}


// WePY
<view> {{ message }} </view>

onLoad () {
    this.message = 'hello world';
    // 在函数运行周期之外的函数里去修改数据需要手动调用$apply方法  这里onLoad是函数运行周期之内 所以不需要
    // this.$apply()
}
```

### 组件代替模板和模块

```html
// 官方
<!-- item.wxml -->
<template name="item">
  <text>{{text}}</text>
</template>

<!-- index.wxml -->
<import src="item.wxml"/>
<template is="item" data="{{text: 'forbar'}}"/>

<!-- index.js -->
var item = require('item.js')




// WePY
<!-- /components/item.wpy -->
 <text>{{text}}</text>

<!-- index.wpy -->
<template>
    <component id="item"></component>
</template>
<script>
    import wepy from 'wepy';
    import Item from '../components/item';
    export default class Index extends wepy.page {
        components = { Item }
    }
</script>
```