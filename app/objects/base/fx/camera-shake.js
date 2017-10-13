/**
 * 
 */

export default class CameraShake extends Phaser.Plugin {
  /**
   * Constructor
   * @param  {Phaser.Game} game The game this plugin is attached to
   * @return {null}      
   */
  constructor(game) {
    super(game);

    /**
     * @private
     * @type {Phaser.Rectangle}
     */
    this._boundsCache = null;

    this.defaults = {
      duration: 20, // in frames
      radius: 20
    };

    /**
     * The radius of the current camera shake
     * @private
     * @type {[Number]}
     */
    this._radius = this.defaults.radius;

    /**
     * the duration of the current camera shake
     * @private
     * @type {Number}
     */
    this._duration = this.defaults.duration;

    this.events = {
      /**
       * Signal that's dispatched when the camera shake ends
       * @type {Phaser.Signal}
       */
      onShakeEnd: new Phaser.Signal()
    };

    /**
     * Determines if the shake is running
     * @private
     * @type {Boolean}
     */
    this._isRunning = false;

    this.setBoundsToWorld();
  }

  /**
   * Accessor function for _isRunning
   * @return {Boolean} whether or not the camera shake is currently running
   */
  get isRunning() {
    return this._isRunning;
  }
  /**
   * Start the camera shake
   * @param  {Number} duration of camera shake in frames
   * @param  {number} radius   of camera shake, the higher, the more severe
   * @return {null}          
   */
  start(duration = this.defaults.duration, radius = this.defaults.radius) {

    let bc = this._boundsCache;
    this._duration = duration;
    this._radius = radius;

    this.game.camera.bounds = new Phaser.Rectangle(bc.x - radius, bc.y - radius, bc.width + radius, bc.height + radius);
    this._checkShake = true;
    this._isRunning = true;
  }

  /**
   * Resets the camera bounds
   * @return {null} 
   */
  reset() {
    let bc = this._boundsCache;
    this.game.camera.bounds = bc;
    this._isRunning = false;
  }

  /**
   * manually stops the camera shake
   * @return {null} 
   */
  stop() {
    this._time = 0;
  }
  /**
   * Sets the bounds cache to the current camera bounds and resets the camera view
   */
  setBoundsToWorld() {
    this._boundsCache = Phaser.Utils.extend(false, {}, this.game.camera.bounds);
    this.reset();
  }
  /**
   * called automatically on each frame of the game
   * @return {null} 
   */
  update() {
    if (this.isRunning && this._duration > 0) {
      let magnitude = this._duration / this._radius * this._radius;
      let x = this.game.rnd.integerInRange(-magnitude, magnitude);
      let y = this.game.rnd.integerInRange(-magnitude, magnitude);

      this.game.camera.x = x;
      this.game.camera.y = y;
      this._duration--;
      if (this._duration <= 0) {
        this.events.onShakeEnd.dispatch();
        this.reset();
      }
    }
  }
}
