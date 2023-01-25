// User input queue
let queue = {x: {p: false, n: false}, z: {p: false, n: false}};

let obj = null;
let drag = false;
let old = {x: null, y: null};

export class PlayerController {

    constructor(object) {
        this.joystick("stick", 64, 8, this.touchAndMouseDown, this.touchAndMouseUp, this.touchAndMouseMove);

        // Controller constructor, saves actor object inside itself.
        this.object = object;
        obj = object
        this.install();
    }

    install() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            window.addEventListener("touchstart", this.touchAndMouseDown, true)
            window.addEventListener("touchend", this.touchAndMouseUp, true)
            window.addEventListener("touchmove", this.touchAndMouseMove)
        } else {
            window.addEventListener("keydown", this.keyDown, true)
            window.addEventListener("keyup", this.keyUp, true)
            window.addEventListener("mousedown", this.touchAndMouseDown, true)
            window.addEventListener("mouseup", this.touchAndMouseUp, true)
            window.addEventListener("mousemove", this.touchAndMouseMove, true)
        }

        console.log("Controller installed.")
    }

    uninstall() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            window.removeEventListener("touchstart", this.touchAndMouseDown, true)
            window.removeEventListener("touchend", this.touchAndMouseUp, true)
            window.removeEventListener("touchmove", this.touchAndMouseMove)
        } else {
            window.removeEventListener("keydown", this.keyDown, true)
            window.removeEventListener("keyup", this.keyUp, true)
            window.removeEventListener("mousedown", this.touchAndMouseDown, true)
            window.removeEventListener("mouseup", this.touchAndMouseUp, true)
            window.removeEventListener("mousemove", this.touchAndMouseMove, true)
        }

        console.log("Controller uninstalled.")
    }

    touchAndMouseMove(e) {
        // Basic mouse/touch movement interaction on drag.
        if (drag) {
            if (e instanceof TouchEvent) {
                e = e.changedTouches[0]

                if (e.clientX > old.x) {
                    queue.x.n = true
                } else if (e.clientX < old.x) {
                    queue.x.p = true
                } else {
                    //queue.x.n = queue.x.p = false
                }

                if (e.clientY < old.y) {
                    queue.z.p = true
                } else if (e.clientY > old.y) {
                    queue.z.n = true
                } else {
                    // queue.z.p = queue.z.n = false
                }

                old.x = e.clientX;
                old.y = e.clientY;
            } else {
                if (e.movementX > 0) {
                    queue.x.n = true;
                } else if (e.movementX < 0) {
                    queue.x.p = true;
                } else {
                    //queue.x.n = queue.x.p = false
                }

                if (e.movementY < 0) {
                    queue.z.p = true;
                } else if (e.movementY > 0) {
                    queue.z.n = true;
                } else {
                    // queue.z.p = queue.z.n = false
                }

            }
        }
    }

    touchAndMouseDown(e) {
        // Basic mouse/touch start of interaction
        if (e instanceof TouchEvent) {
            old.x = e.changedTouches[0].clientX;
            old.y = e.changedTouches[0].clientY;
        }
        drag = true;
    }

    touchAndMouseUp(e) {
        // Basic mouse/touch end of interaction
        drag = false;
        queue.z.p = queue.z.n = queue.x.n = queue.x.p = false
        old = {x: null, y: null};
    }

    keyDown(e) {
        // Basic key press handling
        switch (e.keyCode) {
            case 87: // w
                queue.z.p = true
                break
            case 65: // a
                queue.x.p = true;
                break;
            case 83: // s
                queue.z.n = true
                break
            case 68: // d
                queue.x.n = true
                break
            case 27: // esc
                setTimeout(() => {
                    window.location.reload();
                })
                break
        }
    }

    keyUp(e) {
        // Basic key lift handling
        switch (e.keyCode) {
            case 87: // w
                queue.z.p = false
                break
            case 65: // a
                queue.x.p = false;
                break;
            case 83: // s
                queue.z.n = false
                break
            case 68: // d
                queue.x.n = false
                break
        }
    }

    handler() {
        // Based on queue, applies acceleration to selected axis.
        if (queue.x.p) {
            obj.accel.x = -0.3
        }
        if (queue.x.n) {
            obj.accel.x = 0.3
        }
        if (queue.z.p) {
            obj.accel.z = -0.3
        }
        if (queue.z.n) {
            obj.accel.z = 0.3
        }
    }


    joystick(stickID, maxDistance, deadzone, mouseDown, mouseUp, mouseMove) {
        // stickID: ID of HTML element (representing joystick) that will be dragged
        // maxDistance: maximum amount joystick can move in any direction
        // deadzone: joystick must move at least this amount from origin to register value change

        let stick = document.getElementById(stickID);

        // location from which drag begins, used to calculate offsets
        this.dragStart = null;

        // track touch identifier in case multiple joysticks present
        this.touchId = null;

        this.active = false;
        this.value = {x: 0, y: 0};

        let self = this;

        function handleDown(event) {
            self.active = true;

            // all drag movements are instantaneous
            stick.style.transition = '0s';

            // touch event fired before mouse event; prevent redundant mouse event from firing
            event.preventDefault();

            if (event.changedTouches) {
                self.dragStart = {x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY};
            } else {
                self.dragStart = {x: event.clientX, y: event.clientY};
            }


            // if this is a touch event, keep track of which one
            if (event.changedTouches) {
                self.touchId = event.changedTouches[0].identifier;
            }

            mouseDown(event)
        }

        function handleMove(event) {
            if (!self.active) {
                return;
            }

            // if this is a touch event, make sure it is the right one
            // also handle multiple simultaneous touchmove events
            let touchmoveId = null;
            if (event.changedTouches) {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    if (self.touchId === event.changedTouches[i].identifier) {
                        touchmoveId = i;
                        event.clientX = event.changedTouches[i].clientX;
                        event.clientY = event.changedTouches[i].clientY;
                    }
                }

                if (touchmoveId == null) {
                    return;
                }
            }

            const xDiff = event.clientX - self.dragStart.x;
            const yDiff = event.clientY - self.dragStart.y;
            const angle = Math.atan2(yDiff, xDiff);
            const distance = Math.min(maxDistance, Math.hypot(xDiff, yDiff));
            const xPosition = distance * Math.cos(angle);
            const yPosition = distance * Math.sin(angle);

            // move stick image to new position
            stick.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0px)`;

            // deadzone adjustment
            const distance2 = (distance < deadzone) ? 0 : maxDistance / (maxDistance - deadzone) * (distance - deadzone);
            const xPosition2 = distance2 * Math.cos(angle);
            const yPosition2 = distance2 * Math.sin(angle);
            const xPercent = parseFloat((xPosition2 / maxDistance).toFixed(4));
            const yPercent = parseFloat((yPosition2 / maxDistance).toFixed(4));

            self.value = {x: xPercent, y: yPercent};

            mouseMove(event)
        }

        function handleUp(event) {
            if (!self.active) return;

            // if this is a touch event, make sure it is the right one
            if (event.changedTouches && self.touchId !== event.changedTouches[0].identifier) return;

            // transition the joystick position back to center
            stick.style.transition = '.2s';
            stick.style.transform = `translate3d(0px, 0px, 0px)`;

            // reset everything
            self.value = {x: 0, y: 0};
            self.touchId = null;
            self.active = false;

            mouseUp(event)
        }

        // stick.addEventListener('mousedown', handleDown);
        stick.addEventListener('touchstart', handleDown);
        stick.addEventListener('touchmove', handleMove, {passive: false});
        stick.addEventListener('touchend', handleUp);
    }

}
