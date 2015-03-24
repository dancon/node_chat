# node_chat
nodejs in action 学习笔记
2015.03.24 at Danmark
学习nodejs in action 第二章，这一章是用socket.io创建一个即时在线聊天工具，但是本书中使用的socket.io是v0.9.x版本，
但是npn install socket.io的时候安装的是最新的1.3.5,其中一些api 发生了变化，导致书中的代码无法正常运行。
修改过的地方包括 如下：
1. chat_server.js 第59行代码 var usersInRoom = io.sockets.clients(room); 
   这行代码是用来获取room聊天室中的所有在线用户的，但是在1.3.5中，这个api已经不存在了。
   替代如下：
   var usersInRoom = io.sockets.adapter.rooms[room];
   这行代码中的io.sockets.adapter.rooms是一个对象，这个对象有点奇怪，他把socket.id和当前的聊天室都以key-value的形式保存起来了
   其结构如下：
   { '2lv1GBB56Hkpeg0oAAAA': { '2lv1GBB56Hkpeg0oAAAA': true },
  Lobby: 
   { '2lv1GBB56Hkpeg0oAAAA': true,
     yV1GlJg9XRQ9NwOMAAAB: true,
     fVmW9euAAxwlaC2VAAAC: true },
  yV1GlJg9XRQ9NwOMAAAB: { yV1GlJg9XRQ9NwOMAAAB: true },
  fVmW9euAAxwlaC2VAAAC: { fVmW9euAAxwlaC2VAAAC: true } }
  其中那一串串长字符串就是socket.id ，只有Lobby是真正的聊天室，他对应的值就是这个聊天室中登录的用户对应的socket.id

2.chat_server.js 中从23行处开始
      var rooms = io.sockets.adapter.rooms,
          realRoom = {},
          allSocketId = Object.keys(nickNames);

      for(var attr in rooms){
          if(!allSocketId.contains(attr)){
            realRoom[attr] = true;
          }
      }
  这几行代码是为了获取所有活动的聊天室的。之前的获取方式是 io.sockets.manager.rooms 同样是在socket.io v0.9.x版本中好使
  ，在1.3.5中不存在，所以做了如上修改。
  
  
      
