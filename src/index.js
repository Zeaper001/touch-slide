import './style.css';

class TouchSlider {

    constructor(element) {
        this.element = element;
        this.list = this.element.querySelector('.Touch--Slider__list');
        this.listItems = this.element.querySelectorAll('.Touch--Slider__list li');

        this.state = {
            activeIndex: 0,
            direction: false,
            panXHasStarted: false,
            initialX: 0,
            initialY: 0,
            set index(val) {
                this.activeIndex = val;
                this.stateListener(val);
            },
            get index() {
                return this.activeIndex;
            },
            stateListener: function(val) {},
            registerListener: function(listener) {
                this.stateListener = listener;
            }
        };

        this.setListItemsWidth();
        this.bindEvents();
    }

    bindEvents() {

        this.state.registerListener(() => {
            this.setListXPosition();
        });

        this.list.addEventListener('touchstart', (event) =>{
            this.removeTransition();
            this.state.initialX = event.touches[0].clientX;
            this.state.initialY = event.touches[0].clientY;
        });

        this.list.addEventListener('touchmove', (event) => {

            if(this.state.initialX && this.state.initialY) {
                const currentX = event.touches[0].clientX;
                const currentY = event.touches[0].clientY;
            
                const {initialX, initialY, index, direction} = this.state;

                const x = initialX - currentX;
                const y = initialY - currentY;

                if(!this.state.panXHasStarted) {
                    if (Math.abs(x) > Math.abs(y)) {
                        this.state.panXHasStarted = true;
                    } else {
                        return;
                    }
                }
                
                if (x > 0) {
                    this.panLeft(index, direction, x);
                } else {
                    this.panRight(index, direction, x);
                }
                
            }
        });

        this.list.addEventListener('touchend', () => {

            const {direction} = this.state;

            if(direction === 'left' && this.getPanningThreshold('left')) {
                return this.panLeftEnded();
            }

            if(direction === 'right' && this.getPanningThreshold('right')) {
                return this.panRightEnded();
            }

            this.setListXPosition();
        });
    }

    getPanningThreshold(direction) {
        const sliderLeftPosition = (this.state.index * this.element.clientWidth);
        const threshold = this.element.clientWidth / 6;
        const listOffset = Math.abs(this.list.offsetLeft);

        switch (direction) {
            case 'left':
                return listOffset > (sliderLeftPosition + threshold);
            case 'right':
                return listOffset < (sliderLeftPosition - threshold);
        }
    }

    panLeft(index, direction, x) {
        const panX = (index * this.element.clientWidth) + x;
        this.list.style.left = '-'+panX+'px';
        if(!direction) {
            this.state.direction = 'left';
        }
    }

    panRight(index, direction, x) {
        const panX = (index * this.element.clientWidth) + x;
        if(index === 0) {
            this.list.style.left = Math.abs(panX)+'px';
        } else {
            this.list.style.left = '-'+panX+'px';
        }
        if(!direction) {
            this.state.direction = 'right';
        }
    }

    panLeftEnded() {
        if(this.state.index !== (this.listItems.length - 1)) {
            this.state.index = this.state.index + 1;
        } else {
            this.setListXPosition();
        }
        this.state.panXHasStarted = false;
        this.state.direction = false;
    }
    
    panRightEnded() {
        if(this.state.index !== 0) {
            this.state.index = this.state.index - 1;
        } else {
            this.setListXPosition();
        }
        this.state.panXHasStarted = false;
        this.state.direction = false;
    }

    setListXPosition() {
        this.addTransition();
        this.list.style.left = '-'+this.state.index * this.element.clientWidth+'px';
        this.state.direction = false;
    }

    addTransition() {
        this.list.classList.add('transition-all');
        this.list.classList.add('duration-500');
    }

    removeTransition() {
        this.list.classList.remove('transition-all');
        this.list.classList.remove('duration-500');
    }

    setListItemsWidth() {
        this.listItems.forEach((item) => {
            item.style.width = this.element.clientWidth+'px';
        });
    }

}

const element = document.querySelector('.Touch--Slider');

new TouchSlider(element);