import './style.css';


class TouchSlider {

    constructor(element) {
        this.element = element;
        this.list = this.element.querySelector('.Touch--Slider__list');
        this.listItems = this.element.querySelectorAll('.Touch--Slider__list li');

        this.state = {
            activeIndex: 0,
            direction: false,
            initialX: 0,
            initialY: 0,
            listX: 0,
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
            
                if (Math.abs(x) > Math.abs(y)) {
                    if (event.cancelable) {
                        event.preventDefault();
                    }

                    if (x > 0) {
                        const panX = (index * this.element.clientWidth) + x;
                        this.list.style.left = '-'+panX+'px';
                        if(!direction) {
                            this.state.direction = 'left';
                        }
                        return;
                    }


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

                
            }
        });

        this.list.addEventListener('touchend', () => {

            if(this.state.direction === 'left' && Math.abs(this.list.offsetLeft) > this.getPanningThreshold()) {
                return this.panLeftEnded();
            }

            if(this.state.direction === 'right' && Math.abs(this.list.offsetLeft) < this.getPanningThreshold()) {
                return this.panRightEnded();
            }

            this.setListXPosition();
        });
    }

    panLeftEnded() {
        if(this.state.index !== (this.listItems.length - 1)) {
            this.state.index = this.state.index + 1;
        } else {
            this.setListXPosition();
        }
        this.state.direction = false;
    }
    
    panRightEnded() {
        if(this.state.index !== 0) {
            this.state.index = this.state.index - 1;
        } else {
            this.setListXPosition();
        }
        this.state.direction = false;
    }

    setListXPosition() {
        this.addTransition();
        this.list.style.left = '-'+this.state.index * this.element.clientWidth+'px';
        this.state.direction = false;
    }

    getPanningThreshold() {
        const sliderLeftPosition = (this.state.index * this.element.clientWidth);

        if(this.state.direction === 'right') {
            return sliderLeftPosition - 100;
        }
        return sliderLeftPosition + 100;
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