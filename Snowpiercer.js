tail = game.createRoom("tail", "꼬리칸.png")
jail = game.createRoom("jail", "감옥.png")

////////////////////***Classes***////////////////////

function Door(room, name, closedImage, openedImage, connectedTo, width, hight, size) {
    this.room = room
    this.name = name
    this.closedImage = closedImage
    this.openedImage = openedImage
    this.connectedTo = connectedTo
    this.width = width;
    this.hight = hight;
    this.size = size;
    this.obj = room.createObject(name, closedImage)
}
this.obj.setWidth(size);
this.room.locateObject(this.obj, width, hight);
Door.prototype.onClick = function() {
    if(this.obj.isClosed()) {
        this.obj.open()
    } else if (this.obj.isOpened()) {
        game.move(this.connectedTo)
    }
}
Door.prototype.onOpen = function() {
    this.obj.setSprite(this.openedImage)
}

function Keypad(room, name, image, password, callback) {
    this.room = room
    this.name = name
    this.image = image
    this.password = password
    this.callback = callback

    this.obj = room.createObject(name, image)
}
Keypad.prototype.onClick = function() {
    showKeypad('number', this.password, this.callback)
}

function DoorLock(room, name, image, password, door, message) {
    Keypad.call(this.room, name, image, password, function() {
        printMessage(message)
        door.unlock()
    })
}
DoorLock.prototype = new Keypad()

////////////////////***tail***////////////////////

////////////////////***jail***////////////////////