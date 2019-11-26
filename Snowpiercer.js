Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition

function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}


//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

//////// Drawer Definition

function Drawer(room, name, closedImage, openedImage){
	Object.call(this, room, name, closedImage)

	// Drawer properties
	this.closedImage = closedImage
	this.openedImage = openedImage
}
// inherited from Object
Drawer.prototype = new Object()

Object.member('onClick', function() {
	if(this.id.isClosed()) {
		this.id.open()
	} else if(this.id.isOpened()) {
		this.id.close()
	}
})
Object.member('onOpen', function() {
	this.id.setSprite(this.openedImage)
})
Object.member('onClose', function() {
	this.id.setSprite(this.closedImage)
})

//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition

function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})

//////////createRoom//////////
tail = new Room('tail', '꼬리칸.png')		// 변수명과 이름이 일치해야 한다.
jail = new Room('jail', '감옥.png')		// 변수명과 이름이 일치해야 한다.

//////////tail//////////
tail.door1 = new Door(tail, 'door1', '꼬리칸_닫힘.png', '꼬리칸_열림.png', jail)
tail.door1.resize(150)
tail.door1.locate(180, 440)

tail.bunk1 = new Object(tail, 'bunk1', 'bunk.png')
tail.bunk1.resize(200)
tail.bunk1.locate(530, 480)

tail.bunk2 = new Object(tail, 'bunk2', 'bunk.png')
tail.bunk2.resize(280)
tail.bunk2.locate(720, 500)

tail.gilliam = new Object(tail, 'gilliam', '길리엄.png')
tail.gilliam.resize(100)
tail.gilliam.locate(720, 480)
tail.gilliam.hide()

tail.bunk2.onClick = function() {
	tail.gilliam.show()
}

tail.drum1 = new Item(tail, 'drum1', 'drum1.png')
tail.drum1.resize(150)
tail.drum1.locate(700, 612)

tail.drum2 = new Item(tail, 'drum2', 'drum2.png')
tail.drum2.resize(100)
tail.drum2.locate(100, 552)

tail.cabinet1 = new Drawer(tail, 'cabinet1', '캐비닛-오른쪽-닫힘.png', '캐비닛-오른쪽-열림.png')
tail.cabinet1.resize(120)
tail.cabinet1.locate(900, 500)

tail.cabinet2 = new Drawer(tail, 'cabinet2', '캐비닛-오른쪽-닫힘.png', '캐비닛-오른쪽-열림.png')
tail.cabinet2.resize(130)
tail.cabinet2.locate(1000, 510)

tail.cabinet3 = new Drawer(tail, 'cabinet3', '캐비닛-오른쪽-닫힘.png', '캐비닛-오른쪽-열림.png')
tail.cabinet3.resize(140)
tail.cabinet3.locate(1100, 520)

tail.knife = new Item(tail, 'knife', '칼.png')
tail.knife.resize(100)
tail.knife.locate(960, 500)
 
tail.cart = new Object(tail, 'cart', 'cart.png')
tail.cart.resize(180)
tail.cart.locate(350, 490)

tail.protein = new Item(tail, 'protein', '양갱.png')
tail.protein.resize(110)
tail.protein.locate(360, 510)

//////////jail//////////


Game.start(tail, "여긴... 어디지??")