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
Game.combination = function(combination1, combination2, result) {
	game.makeCombination(combination1.id, combination2.id, result.id)
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
	} else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	} else if(this.id.isLocked()) {
		printMessage('잠겨있다.')
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
	} else if(this.id.isLocked()) {
		printMessage('잠겨있다.')
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
tunel = new Room('tunnel', '배경-1.png')

//////////tail//////////
tail.door1 = new Door(tail, 'door1', '꼬리칸_닫힘.png', '꼬리칸_열림.png', jail)
tail.door1.resize(150)
tail.door1.locate(180, 440)
tail.door1.lock()

tail.door1.broken = false
tail.door1.onClick = function() {
	if(tail.door1.isOpened()) {
		Game.move(jail)
	} else {
		printMessage('단단하게 잠겨있다.')
	}
	if(tail.drum3.isHanded()) {
		tail.door1.setSprite('꼬리칸_열림.png')
		tail.door1.open()
		if(!tail.door1.broken) {
			showVideoPlayer('break.mp4')
			tail.door1.broken = true
		}

	}
}

tail.bunk1 = new Object(tail, 'bunk1', 'bunk.png')
tail.bunk1.resize(200)
tail.bunk1.locate(530, 480)

tail.bunk2 = new Object(tail, 'bunk2', 'bunk.png')
tail.bunk2.resize(280)
tail.bunk2.locate(720, 500)

tail.gilliam = new Object(tail, 'gilliam', '길리엄.png')
tail.gilliam.resize(120)
tail.gilliam.locate(710, 480)
tail.gilliam.hide()

tail.bunk2.onClick = function() {
	tail.gilliam.show()
}

tail.cart = new Object(tail, 'cart', 'cart.png')
tail.cart.resize(180)
tail.cart.locate(350, 490)

tail.protein = new Item(tail, 'protein', '양갱.png')
tail.protein.resize(110)
tail.protein.locate(360, 510)

tail.protein.onClick = function() {
	if(tail.gilliam.talk1) {
		tail.protein.pick()
	} else {
		printMessage('오늘 배급받을 단백질 블럭')
	}
}

tail.Note = new Item(tail, 'Note', 'Note.png')
tail.Note.hide()

tail.drum1 = new Item(tail, 'drum1', 'drum1.png')
tail.drum1.resize(150)
tail.drum1.locate(700, 612)

tail.drum1.onClick = function() {
	if(tail.gilliam.talk2) {
		tail.drum1.pick()
	} else {
		printMessage('드럼통이다.')
	}
}

tail.drum2 = new Item(tail, 'drum2', 'drum2.png')
tail.drum2.resize(100)
tail.drum2.locate(100, 552)

tail.drum2.onClick = function() {
	if(tail.gilliam.talk2) {
		tail.drum2.pick()
	} else {
		printMessage('튼튼하군!')
	}
}

tail.drum3 = new Item(tail, 'drum3', 'drum3.png')
tail.drum3.hide()

Game.combination(tail.drum1, tail.drum2, tail.drum3)

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
tail.knife.hide()

tail.cabinet2.onOpen = function() {
    tail.cabinet2.setSprite("캐비닛-오른쪽-닫힘.png")
    tail.knife.hide()
}
tail.cabinet2.onClose = function() {
    tail.cabinet2.setSprite("캐비닛-오른쪽-열림.png")
    tail.knife.show()
}

tail.bettary = new Item(tail, 'bettary', '건전지.png')
tail.bettary.resize(40)
tail.bettary.locate(875, 540)
tail.bettary.hide()

tail.key = new Item(tail, 'key', '열쇠.png')
tail.key.resize(40)
tail.key.locate(875, 620)
tail.key.hide()

tail.cabinet1.onOpen = function() {
    tail.cabinet1.setSprite("캐비닛-오른쪽-닫힘.png")
	tail.bettary.hide()
	tail.key.hide()
}
tail.cabinet1.onClose = function() {
    tail.cabinet1.setSprite("캐비닛-오른쪽-열림.png")
	tail.bettary.show()
	tail.key.show()
}

tail.pepper = new Item(tail, 'pepper', '페퍼로니.png')
tail.pepper.resize(50)
tail.pepper.locate(1070, 500)
tail.pepper.hide()

tail.cabinet3.onOpen = function() {
    tail.cabinet3.setSprite("캐비닛-오른쪽-닫힘.png")
	tail.pepper.hide()
}
tail.cabinet3.onClose = function() {
    tail.cabinet3.setSprite("캐비닛-오른쪽-열림.png")
	tail.pepper.show()
}

Game.combination(tail.protein, tail.knife, tail.Note)

var click = 0;
var click1 = 0;
tail.gilliam.talk1 = false
tail.gilliam.talk2 = false
tail.gilliam.onClick = function() {
	if(tail.Note.isHanded()) {
		if(click1 == 0) {
			printMessage('길리엄: 어디보자...(계속 클릭)')
			tail.gilliam.talk2 = true
			click1 += 1
		} else if(click1 == 1) {
			printMessage('길리엄: 남궁...민수?(계속 클릭)')
			click1 += 1
		} else if(click1 == 2) {
			printMessage('길리엄: 그는 이 열차 최고의 암호 전문가지. 아마 그를 찾으면 앞칸으로 갈 수 있을거야.(계속 클릭)')
			click1 += 1
		} else if(click1 == 3) {
			printMessage('길리엄: 그 전에 바로 앞에 저 문부터 뚫어야 할텐데...(계속 클릭)')
			click1 += 1
		} else if(click1 == 4) {
			printMessage('길리엄: 자네들끼리 힘을 합쳐서 저 문을 뚫어보게!(계속 클릭)')
			click1 += 1
		} else if(click1 == 5) {
			printMessage('꼬리칸의 사람들끼리 힘을 합쳐야 다음 칸으로 탈출할 수 있습니다.')
			click1 += 1
		} else if(click1 == 6) {
			printMessage('길리엄: 저 드럼통들을 붙여보는게 어떤가?')
		}
	} else {
		if(click == 0) {
			printMessage('길리엄: 불렀는가?(계속 클릭)')
			tail.gilliam.talk1 = true
			click += 1
		} else if(click == 1) {
			printMessage('길리엄: 꼬리칸을 탈출하여 반란을 일으킨다고?(계속 클릭)')
			click += 1
		} else if(click == 2) {
			printMessage('길리엄: 쉽지 않을거야... 한 사람의 도움이 필요할걸세(계속 클릭)')
			click += 1
		} else if(click == 3) {
			printMessage('길리엄: 우선 쪽지가 필요해...(계속 클릭)')
			click += 1
		} else if(click == 4) {
			printMessage('앞칸에서 보내온 쪽지를 찾아 길리엄에게 보여주세요')
			click += 1
		} else if(click == 5 ) {
			printMessage('길리엄: 쪽지는 아직인가?')
			click += 1
		} else if(click == 6) {
			printMessage('길리엄: 단백질 블럭에 속에 들어있다는 소문은 들었는데...')
			click -= 1
		}
	}
}

//////////jail//////////
jail.door1 = new Door(jail, 'door1', '문2-좌-닫힘.png', '문2-좌-열림.png', tunel)
jail.door1.resize(100)
jail.door1.locate(350, 300)
jail.door1.lock()

jail.lock1 = new DoorLock(jail, 'lock1', '키패드.png', '2022', jail.door1, '문이 열린다.')
jail.lock1.resize(80)
jail.lock1.locate(420, 290)

jail.door2 = new Door(jail, 'door2', '화살표.png', '화살표.png', tail)
jail.door2.resize(80)
jail.door2.locate(1200, 230)

jail.number1 = new Object(jail, 'number1', 'number1.png')
jail.number1.resize(40)
jail.number1.locate(1140, 190)

jail.number2 = new Object(jail, 'number2', 'number2.png')
jail.number2.resize(40)
jail.number2.locate(870, 160)

jail.number3 = new Object(jail, 'number3', 'number3.png')
jail.number3.resize(40)
jail.number3.locate(630, 120)

jail.jail1 = new Drawer(jail, 'jail1', '감옥_닫힘.png', '감옥_열림.png')
jail.jail1.resize(200)
jail.jail1.locate(1100, 410)
jail.jail1.lock()

jail.keypad1 = new Keypad(jail, 'keypad1', '키패드-우.png', '1234', function() {
	printMessage('감옥1: 암호 해제.')
	jail.jail1.unlock()
}) 
jail.keypad1.resize(20)
jail.keypad1.locate(1140, 250)

jail.jail2 = new Drawer(jail, 'jail2', '감옥_닫힘.png', '감옥_열림.png')
jail.jail2.resize(190)
jail.jail2.locate(840, 370)
jail.jail2.lock()

jail.keypad2 = new Keypad(jail, 'keypad2', '키패드-우.png', '3456', function() {
	printMessage('감옥2: 암호 해제.')
	jail.jail2.unlock()
}) 
jail.keypad2.resize(20)
jail.keypad2.locate(870, 220)

jail.jail2.onOpen = function() {
    jail.jail2.setSprite("감옥_닫힘.png")
}
jail.jail2.onClose = function() {
	jail.jail2.setSprite("감옥_열림.png")
	if(jail.kronole.isHanded()){
		jail.NGMS.show()
	} else {
		printMessage('남궁민수를 발견했다. 하지만 그는 일어나지 않는다.')
	}
}

jail.jail3 = new Drawer(jail, 'jail3', '감옥_닫힘.png', '감옥_열림.png')
jail.jail3.resize(180)
jail.jail3.locate(590, 310)
jail.jail3.lock()

jail.keypad3 = new Keypad(jail, 'keypad3', '키패드-우.png', '5678', function() {
	printMessage('감옥3: 암호 해제.')
	jail.jail3.unlock()
}) 
jail.keypad3.resize(20)
jail.keypad3.locate(630, 170)

jail.translator1 = new Item(jail, 'translator1', '번역기.png')
jail.translator1.resize(30)
jail.translator1.locate(730, 220)

jail.translator2 = new Item(jail, 'translator2', '번역기.png')
jail.translator2.resize(30)
jail.translator2.locate(750, 280)

jail.translator3 = new Item(jail, 'translator3', '번역기.png')
jail.translator3.resize(30)
jail.translator3.locate(710, 270)

jail.NGMS = new Object(jail, 'NGMS', '남궁민수.png')
jail.NGMS.resize(200)
jail.NGMS.locate(880, 370)
jail.NGMS.hide()

var clickNGMS = 0;
var clickNGMS1 = 0;
jail.NGMS.onClick = function() {
	if(jail.translator2.isHanded()) {
		if(clickNGMS1 == 0) {
			printMessage('남궁민수: 왜 불렀어(계속 클릭)')
			clickNGMS1 += 1
		} else if(clickNGMS1 == 1) {
			printMessage('남궁민수: 꼬리칸을 탙출하고 싶다고?(계속 클릭)')
			clickNGMS1 += 1
		} else if(clickNGMS1 == 2) {
			printMessage('남궁민수: 그래서 도움이 필요하다고?(계속 클릭)')
			clickNGMS1 += 1
		} else if(clickNGMS1 == 3) {
			printMessage('남궁민수: (대충 험한말) (계속 클릭)')
			clickNGMS1 += 1
		} else if(clickNGMS1 == 4) {
			printMessage('남궁민수: 크로놀을 주겠다고..? 그럼 거절할 수가 없지.(계속 클릭)')
			clickNGMS1 += 1
		} else if(clickNGMS1 == 5) {
			printMessage('남궁민수: 이 열차를 만든것이 30년 전이니깐 그때의 년도로 비밀번호를 설정했을거야.')
			clickNGMS1 += 1
		} else {
			printMessage('남궁민수: password = that_Year - 30;')
		}
	} else {
		if(clickNGMS == 0) {
			printMessage('남궁민수: %dㄴ8*ㄹㅇㄴdfl?dfaKKD124????')
			clickNGMS += 1
		} else if(clickNGMS == 1) {
			printMessage('말을 알아 들을수가 없어... 번역기가 어디에 있지?(계속 클릭)')
			clickNGMS += 1
		} else if(clickNGMS == 2) {
			printMessage('남궁민수와 대화하기 위해서는 번역기가 필요합니다.')
			clickNGMS = 0
		}
	}
}

jail.box1 = new Drawer(jail, 'box1', '상자3-닫힘.png', '상자3-열림.png')
jail.box1.resize(300)
jail.box1.locate(150, 570)

jail.kronole = new Item(jail, 'kronole', '크로놀.png')
jail.kronole.resize(80)
jail.kronole.locate(150, 590)
jail.kronole.hide()

jail.kronole.onClick = function() {
	printMessage('크로놀을 획득했다.')
	jail.kronole.pick()
}

jail.box1.onOpen = function() {
    jail.box1.setSprite("상자3-닫힘.png")
	jail.kronole.hide()
}
jail.box1.onClose = function() {
    jail.box1.setSprite("상자3-열림.png")
	jail.kronole.show()
}

jail.book = new Object(jail, 'book', '노트.png')
jail.book.resize(100)
jail.book.locate(350, 570)

jail.book.onClick = function() {
	showImageViewer('펼친책.png', '펼친책.txt')
}

//////////gameStart//////////
Game.start(tail, ' ')
showVideoPlayer('intro.mp4')
printMessage('여긴... 어디지?')