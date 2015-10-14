niuKeys = new Mongo.Collection('niuKeys');
niuItems = new Mongo.Collection('niuItems');


if (Meteor.isClient) {
  // counter starts at 0
  // Session.setDefault('counter', 0);

  Template.niuResult.helpers({
    counter: function () {
      return Session.get('niuResult');
    }
  });

  Template.niuSearch.events({
    'submit form': function () {
      event.preventDefault();
      var query = event.target.query.value;
      
      Meteor.call('niuSearch', query, function(error, result) {
        if (result.success) {
          Session.set('niuResult', result.result);
//          console.log(result.result);
        }
      });
      
      return false;
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    niuSearch: function(query) {
      var result = niuKeys.findOne({keywords: query});
      if (!result) {
        return {
          success: false,
          result: '未找到'
        };
      }
      
      var itemIds = result.ranks,
          length = itemIds.length,
          items = [];
      for (var i=0; i<length; i++) {
        var item = niuItems.findOne(itemIds[i]);
        item.index = i+1;
        items.push(item);
      }
      
      return {
        success: true,
        result: items
      }
      
    }
  })
  
  Meteor.startup(function () {
    if (!niuKeys.findOne()) {
      var i1, i2, i3;
      
      i1 = niuItems.insert({title: '迪拜塔', desc: '哈利法塔又名迪拜塔，位于阿拉伯联合酋长国（阿联酋）最大的城市迪拜市。'});
      i2 = niuItems.insert({title: '上海中心大厦', desc: '上海中心大厦简称上海塔，位于上海陆家嘴金融中心区。'});
      i3 = niuItems.insert({title: '麦加皇家钟塔饭店', desc: '麦加皇家钟塔饭店是一栋位于沙特阿拉伯王国的伊斯兰教圣城麦加。'});
      niuKeys.insert({keywords: '高楼', ranks: [i1, i2, i3]});
      
      
      i1 = niuItems.insert({title: 'Kitcho(吉兆岚山本店)日本京都', desc: '人均：$600：Kitcho位于京都岚山脚下、大堰川畔，是日本最著名的怀石料理亭之一，堪称美食界的梦幻圣地。料理本身与精致的器皿、得天独厚的自然风景、无微不至的日式服务甚至是古都京都的文化历史底蕴完美地结合在一起，将日本料理对感官体验的极致追求展现得淋漓尽致'});
      i2 = niuItems.insert({title: 'Le Meurice 法国巴黎', desc: '人均：$509　巴黎Le Meurice酒店位于卢浮宫与协和广场之间，一直以来为皇室贵族和社会名流提供最奢华的服务，位于酒店内的米其林三星餐厅Le Meurice正对杜乐丽花园，餐厅内部仿照凡尔赛宫的设计风格，让宾客享受到如皇室般的用餐体验。这里的美味自然是纯正而无可挑剔。每一份菜品都以最优雅的方式呈现。光是看已经觉得很吸引人。每个盘子上的美食都像一件件精致的艺术品，让人不敢轻易掂碰。在这里进餐是视觉的享受，更是味蕾的享受。每一样食材到了这里都会幻化成艺术品。'});
      i3 = niuItems.insert({title: 'Masa 美国纽约', desc: '人均：$450　号称纽约最贵的日本料理餐厅，裡面的食材完全砸重本去购买，所以可以在此餐厅吃到很多稀奇古怪的特殊海鲜，而且会用电脑建档记住每位客人的喜好，也难怪会有很多人愿意花大钱朝圣。'});
      niuKeys.insert({keywords: '最贵餐厅', ranks: [i1, i2, i3]});
      
      
      //niuBase.insert({keywords: '', ranks: []});
    }
    
    // code to run on server at startup
  });
}
