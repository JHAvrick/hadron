class BitmapTextCounter extends Phaser.BitmapText {
	constructor(game, x, y, font, text, size, align){
		super(game, x, y, font, text, size, align);
		this.game = game;
		this.anchor.setTo(.5, .5);

    /**
     * The padding string indicating both leading zero count and the symbol to use
     * @private
     * @type {Number}
     */
		this._padding = '';

    /**
     * The internal count
     * @private
     * @type {Number}
     */				
		this._count = 0;

    /**
     * The text to be displayed. This can be set manually, but will be overrided any time the count is set.
     * @public
     * @type {String}
     */				
		this.text = '0';

		this.game.add.existing(this);
	}

	_pad(count){
		if (this._padding === '') 
			return count;
		else 
			return this._padding.substr(0, this._padding.length - count.toString().length) + count.toString();
	}

  /**
   * Animate the counter to a new number
   * @param  {Number} the new count to be displayed
   * @param  {Number} [duration = 1000] the duration of the animation in milliseconds
   * @callback {onComplete} called when the count has completed animation to the new value
   * @return {null}          
   */
	toCount(newCount, duration = 1000, onComplete){
		var tweenCount = this.game.add.tween(this).to( { _count: newCount }, duration || 1000, Phaser.Easing.Quadratic.Out, true);
				tweenCount.onUpdateCallback(() => {
					this._count = Math.round(this._count);
					this.text = this._pad(this._count);
				});

				tweenCount.onComplete.add(() => {
					this._count = Math.round(this._count);

					if (onComplete) onComplete();
				});
	}

  /**
   * Set the padding amount and symbol
   * @param  {String} A string such as "000000" or "######" indicating the total length and symbol for padding 
   * @return {null}          
   */
	usePadding(padding){
		this._padding = padding;
		this.text = this._pad(this._count); //apply the padding when set
	}

}

export default BitmapTextCounter;