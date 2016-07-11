module.exports = {

    template: require( './slug.template.html' ),

    props: {
        model: {
            twoWay: String,
            // type: String,
            // default: null,
        },
        from: {
            type: String,
            default: null,
        },

        type: {
            type: String,
            default: 'case',
        },

        disabled: {
            type: Boolean,
            default: false,
        }

    },

    data: function() {
        return {
            // model: null,
            // from: null,
            shouldFollowLead: true,

            hasFocus: false,
            watchObject: null,
            leadWatchObject: null,
        };
    },

    ready: function() {

        // Force set the values we are following
        if ( ! this.from ) {
            this.$set( 'from', '' );
        }
        if ( ! this.model ) {
            this.$set( 'model', '' );
        }

        // Check if we should follow the lead
        this.shouldFollowLead = ! this.model || this.model == '';

        // Set watchers
        this.setWatchers();
    },

    methods: {

        // Check if we have focus in slug field
        onFocus: function() {
            this.$set( 'hasFocus', true );
        },
        onBlur: function() {
            this.$set( 'hasFocus', false );
        },

        // Handle normal typing in slug
        onType: function() {
            if ( this.hasFocus ) {
                this.$set( 'shouldFollowLead', ! this.model || this.model == '' );
            }

        },

        // Handle type in the field we are watching
        onLeadType: function() {
            // console.log('LeadType: ' + this.from);
            if ( this.shouldFollowLead ) {
                this.convertToSlug();
            }
        },

        // Convert to the slug from the field we are following
        convertToSlug: function() {
            switch (this.type) {
                case 'dash':
                    var str = this.from.toLowerCase()
                        .replace(/[^\w ]+/g,'')
                        .replace(/ +/g,'-');
                    break;
                
                default:
                    var str = this.from.toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{0})|^([a-z])/g, function(_, g1, g2, g3) {
                        return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase();
                    } )
                        .replace( /[^\w ]/, '' )
                        .replace(/ +/g,'')
                        .replace(/^([a-z])/gi, function(_, g1 ) {
                            return g1.toLowerCase();
                        })
            }

            // console.log(words);
            // var str = this.from.toLowerCase().replace(/([^a-z]|^)([a-z])(?=[a-z]{2})/g, function(_, g1, g2) {
                // return g1 + g2.toUpperCase();
            // } );
            // var str = this.from.toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g, function(_, g1, g2, g3) {
                // return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase();
            // } );
            this.$set( 'model', str );
            // var newText = this.from.toLowerCase()
                // .replace(/[^\w ]+/g,'')
                // .replace(/ +/g,'-');
            // this.$set( 'model', newText );
        },

        // Set the watchers for the input types
        setWatchers: function() {

            this.leadWatchObject = this.$watch( 'from', function() {
                this.onLeadType();
            } );

            this.watchObject = this.$watch( 'model', function() {
                this.onType();
            } );

        },

    }

}
