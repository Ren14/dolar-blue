parasails.registerPage('homepage', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    heroHeightSet: false,
    dolarCompra: 200,
    cotizacion: 0,
    impuestoPais: 0,
    dolarSolidario: 0,
    cantidadPesos: 0,
    cotizacionDAI: 0, // Obtener desde API
    cantidadDAI: 0,
    cotizacionDAIVenta: 0, // Obtener desde API
    diferencia: 0,
    ganancia: 0,

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.getCotizacionDolar();
    this.getCotizacionDAIUSD();
    this.getCotizacionDAIARS();
  },
  mounted: async function(){
    this._setHeroHeight();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    clickHeroButton: async function() {
      // Scroll to the 'get started' section:
      $('html, body').animate({
        scrollTop: this.$find('[role="scroll-destination"]').offset().top
      }, 500);
    },

    // Private methods not tied to a particular DOM event are prefixed with _
    _setHeroHeight: function() {
      var $hero = this.$find('[full-page-hero]');
      var headerHeight = $('#page-header').outerHeight();
      var heightToSet = $(window).height();
      heightToSet = Math.max(heightToSet, 500);//« ensure min height of 500px - header height
      heightToSet = Math.min(heightToSet, 1000);//« ensure max height of 1000px - header height
      $hero.css('min-height', heightToSet - headerHeight+'px');
      this.heroHeightSet = true;
    },

    getCotizacionDolar: async function(){
      await axios.get(`https://criptoya.com/api/brubank`)
      .then((result) => {           
        console.log(result)  ;
        this.cotizacion = result.data.ask;  
        this.impuestoPais = this.cotizacion * 0.3; 
        this.dolarSolidario = this.cotizacion + this.impuestoPais;
        this.calcularValores();
      })
      .catch(err => {
        console.log(err);
        console.log("Hubo un error al obtener la cotización del dolar de Brubank. Se toma el valor por defecto");
        this.cotizacion = 78.5; ////// CAMPERIÑO  
        this.impuestoPais = this.cotizacion * 0.3; 
        this.dolarSolidario = this.cotizacion + this.impuestoPais;
        this.calcularValores();
      });    
    },

    getCotizacionDAIUSD: async function(){
      await axios.get('https://criptoya.com/api/buenbit/dai/usd')
      .then((result) => {           
        console.log(result)  ;
        this.cotizacionDAI = result.data.ask;
        this.calcularValores();
      })
      .catch(err => {
        console.log("Hubo un error al obtener la cotización de las DAI/USD. Se toma el valor por defecto");
        console.log(err);
        this.cotizacionDAI = 1.09; ////// CAMPERIÑO
        this.calcularValores();
      });  
    },

    getCotizacionDAIARS: async function(){
      
      await axios.get('https://criptoya.com/api/buenbit/dai/ars')
      .then((result) => {           
        console.log(result)  ;
        this.cotizacionDAIVenta = result.data.totalBid;
        this.calcularValores();
      })
      .catch(err => {
        console.log("Hubo un error al obtener la cotización de las DAI/ARS. Se toma el valor por defecto");
        console.log(err);
        this.cotizacionDAIVenta = 124; ////// CAMPERIÑO
        this.calcularValores();
      });  
    },


    calcularValores: function(){
      this.cantidadPesos = this.dolarCompra * this.dolarSolidario; 
      this.cantidadDAI = this.dolarCompra / this.cotizacionDAI;
      this.diferencia = this.cantidadDAI * this.cotizacionDAIVenta;
      this.ganancia = this.diferencia - this.cantidadPesos ;

      // Modifico el tamño de los decimales
      this.cantidadPesos = new Intl.NumberFormat("ar-AR").format(this.cantidadPesos);
      this.cantidadDAI = this.cantidadDAI.toFixed(3);
      this.diferencia = new Intl.NumberFormat("ar-AR").format(this.diferencia);
      this.ganancia = new Intl.NumberFormat("ar-AR").format(this.ganancia);

    }

  }
});
