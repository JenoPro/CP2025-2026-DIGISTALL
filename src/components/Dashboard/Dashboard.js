export default {
  name: 'Dashboard',
  components: {},
  data() {
    return {
      pageTitle: 'Dashboard',
    }
  },
  mounted() {
    this.initializeDashboard()
  },
  methods: {
    // Initialize collectors page
    initializeDashboard() {
      console.log('Dashboard page initialized')
      // Add any initialization logic here
    },
  },
}
