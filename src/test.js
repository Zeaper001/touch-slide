class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof(element) === 'string' ? document.querySelector(element) : element;
        this.list = this.element.querySelector('.Touch--Slider__list');

        this.list.addEventListener('touchstart', (evt) => {
            this.xDown = evt.touches[0].clientX;
            this.yDown = evt.touches[0].clientY;
        }, false);

        this.list.addEventListener('touchmove', (evt) => {
            this.handleTouchMove(evt);
        }, false);
    }

    onLeft(callback) {
        this.onLeft = callback;

        return this;
    }

    onRight(callback) {
        this.onRight = callback;

        return this;
    }

    onUp(callback) {
        this.onUp = callback;

        return this;
    }

    onDown(callback) {
        this.onDown = callback;

        return this;
    }

    handleTouchMove(evt) {
        // if ( ! this.xDown || ! this.yDown ) {
        //     return;
        // }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) {
            if ( this.xDiff > 0 ) {
                this.onLeft(() => {
                    console.log('Left')
                });
            } else {
                this.onRight(() => {
                    console.log('Right')
                });
            }
        } else {
            if ( this.yDiff > 0 ) {
                this.onUp(() => console.log('Up'));
            } else {
                this.onDown(() => console.log('Down'));
            }
        }

        // Reset values.
        // this.xDown = null;
        // this.yDown = null;
    }
}

export default Swipe;