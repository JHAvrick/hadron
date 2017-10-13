class RGBSplitFilter extends PIXI.AbstractFilter {
    constructor(red, green, blue) {
        super();

        this.passes = [this];

        // set the uniforms
        this.uniforms = {
            red: {type: '2f', value: red || {x: 1, y: 2} },
            green: {type: '2f', value: green || {x: -2, y: 0} },
            blue: {type: '2f', value: blue || {x: -1, y: 1} },
            dimensions:   {type: '4fv', value:[0,0,0,0]}
        };

        this.fragmentSrc = [
            'precision mediump float;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'uniform vec2 red;',
            'uniform vec2 green;',
            'uniform vec2 blue;',
            'uniform vec4 dimensions;',
            'uniform sampler2D uSampler;',

            'void main(void) {',
            '   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;',
            '   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;',
            '   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;',
            '   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;',
            '}'
        ];

    }

    get red(){ return this.uniforms.red.value; }
    set red(value){ this.uniforms.red.value = value; }

    get green(){ return this.uniforms.green.value; }
    set green(value){ this.uniforms.green.value = value; }

    get blue(){ return this.uniforms.blue.value; }
    set blue(value){ this.uniforms.blue.value = value; }


}

export default RGBSplitFilter;