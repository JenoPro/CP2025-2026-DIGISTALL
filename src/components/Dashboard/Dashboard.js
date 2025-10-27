import Chart from 'chart.js/auto'

export default {
  name: 'Dashboard',
  components: {},
  data() {
    return {
      pageTitle: 'Dashboard',
      // Static data for metrics
      totalStalls: 156,
      totalStallholders: 142,
      totalPayments: 1250000,
      totalCollectors: 8,

      // Static data for recent payments
      recentPayments: [
        {
          id: 1,
          stallholder: 'Maria Santos',
          amount: 5500,
          date: '2025-10-12',
          status: 'Paid',
        },
        {
          id: 2,
          stallholder: 'Juan Dela Cruz',
          amount: 4200,
          date: '2025-10-11',
          status: 'Paid',
        },
        {
          id: 3,
          stallholder: 'Ana Rodriguez',
          amount: 6000,
          date: '2025-10-11',
          status: 'Pending',
        },
        {
          id: 4,
          stallholder: 'Carlos Mendez',
          amount: 3800,
          date: '2025-10-10',
          status: 'Paid',
        },
        {
          id: 5,
          stallholder: 'Sofia Garcia',
          amount: 5200,
          date: '2025-10-09',
          status: 'Overdue',
        },
      ],

      // Static data for active collectors
      activeCollectors: [
        {
          id: 1,
          name: 'Roberto Aquino',
          area: 'Section A',
          collections: 24,
          status: 'Active',
        },
        {
          id: 2,
          name: 'Elena Ramos',
          area: 'Section B',
          collections: 31,
          status: 'Active',
        },
        {
          id: 3,
          name: 'Diego Torres',
          area: 'Section C',
          collections: 19,
          status: 'Break',
        },
        {
          id: 4,
          name: 'Carmen Lopez',
          area: 'Section D',
          collections: 28,
          status: 'Active',
        },
        {
          id: 5,
          name: 'Miguel Santos',
          area: 'Section E',
          collections: 22,
          status: 'Active',
        },
      ],

      // Static data for stall overview
      stallOverview: [
        {
          id: 1,
          stallId: 'S001',
          stallholder: 'Maria Santos',
          location: 'Section A - Row 1',
          monthlyFee: 5500,
          lastPayment: '2025-10-12',
          status: 'Active',
        },
        {
          id: 2,
          stallId: 'S002',
          stallholder: 'Juan Dela Cruz',
          location: 'Section A - Row 1',
          monthlyFee: 4200,
          lastPayment: '2025-10-11',
          status: 'Active',
        },
        {
          id: 3,
          stallId: 'S003',
          stallholder: 'Ana Rodriguez',
          location: 'Section B - Row 2',
          monthlyFee: 6000,
          lastPayment: '2025-09-28',
          status: 'Overdue',
        },
        {
          id: 4,
          stallId: 'S004',
          stallholder: 'Carlos Mendez',
          location: 'Section C - Row 1',
          monthlyFee: 3800,
          lastPayment: '2025-10-10',
          status: 'Active',
        },
        {
          id: 5,
          stallId: 'S005',
          stallholder: 'Sofia Garcia',
          location: 'Section D - Row 3',
          monthlyFee: 5200,
          lastPayment: '2025-10-09',
          status: 'Active',
        },
        {
          id: 6,
          stallId: 'S006',
          stallholder: 'Vacant Stall',
          location: 'Section E - Row 1',
          monthlyFee: 4500,
          lastPayment: 'N/A',
          status: 'Vacant',
        },
      ],

      // Chart instances
      paymentChart: null,
      occupancyChart: null,
      collectorChart: null,
    }
  },
  mounted() {
    this.initializeDashboard()
    // Initialize charts after component is mounted with a longer delay
    this.$nextTick(() => {
      setTimeout(() => {
        console.log('🎯 Attempting to initialize charts...')
        this.initializeCharts()
      }, 500)
    })
  },
  beforeUnmount() {
    // Clean up chart instances
    if (this.paymentChart) {
      this.paymentChart.destroy()
    }
    if (this.occupancyChart) {
      this.occupancyChart.destroy()
    }
    if (this.collectorChart) {
      this.collectorChart.destroy()
    }
  },
  methods: {
    // Initialize dashboard
    initializeDashboard() {
      console.log('✅ Dashboard page initialized')
      console.log('📊 Dashboard metrics loaded:', {
        stalls: this.totalStalls,
        stallholders: this.totalStallholders,
        payments: this.totalPayments,
        collectors: this.totalCollectors,
      })
    },

    // Initialize charts using Chart.js
    initializeCharts() {
      console.log('📊 Initializing interactive charts...')
      console.log('📦 Chart.js loaded:', typeof Chart !== 'undefined')
      console.log('🎯 Canvas elements found:', {
        payment: !!this.$refs.paymentChart,
        occupancy: !!this.$refs.occupancyChart,
        collector: !!this.$refs.collectorChart,
      })

      // Ensure Chart.js is available
      if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not available')
        return
      }

      try {
        this.createPaymentChart()
        this.createOccupancyChart()
        this.createCollectorChart()
        console.log('✅ All charts initialized successfully')
      } catch (error) {
        console.error('❌ Error initializing charts:', error)
        console.error('❌ Stack trace:', error.stack)
      }
    },

    // Create payment trends chart
    createPaymentChart() {
      try {
        const ctx = this.$refs.paymentChart?.getContext('2d')
        if (!ctx) {
          console.warn('Payment chart canvas not found')
          return
        }

        console.log('Creating payment chart...')

        // Ensure data is properly formatted
        const chartData = {
          labels: ['Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12'],
          datasets: [
            {
              label: 'Daily Payments',
              data: [45000, 52000, 38000, 61000, 48000, 55000, 49000],
              borderColor: 'rgb(0, 33, 129)',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: 'rgb(0, 33, 129)',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: '#1565c0',
              pointHoverBorderColor: '#ffffff',
              pointHoverBorderWidth: 3,
              // Add explicit configuration to prevent issues
              hidden: false,
              parsing: false,
            },
          ],
        }

        this.paymentChart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index',
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 14,
                    weight: '500',
                  },
                },
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgb(0, 33, 129)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: false,
                callbacks: {
                  label: function (context) {
                    return `Payment: ₱${context.parsed.y.toLocaleString()}`
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  color: '#666',
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  color: '#666',
                  font: {
                    size: 12,
                  },
                  callback: function (value) {
                    return '₱' + value.toLocaleString()
                  },
                },
              },
            },
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart',
            },
            hover: {
              animationDuration: 300,
            },
          },
        })
        console.log('✅ Payment chart created successfully')
      } catch (error) {
        console.error('❌ Error creating payment chart:', error)
      }
    },

    // Create occupancy chart
    createOccupancyChart() {
      try {
        const ctx = this.$refs.occupancyChart?.getContext('2d')
        if (!ctx) {
          console.warn('Occupancy chart canvas not found')
          return
        }

        console.log('Creating occupancy chart...')
        const occupiedStalls = 142
        const vacantStalls = 14

        // Validate data
        if (occupiedStalls < 0 || vacantStalls < 0) {
          console.warn('Invalid stall data')
          return
        }

        const chartData = {
          labels: ['Occupied Stalls', 'Vacant Stalls'],
          datasets: [
            {
              data: [occupiedStalls, vacantStalls],
              backgroundColor: ['#4caf50', '#ff9800'],
              borderColor: ['#388e3c', '#f57c00'],
              borderWidth: 3,
              hoverBackgroundColor: ['#66bb6a', '#ffb74d'],
              hoverBorderColor: ['#2e7d32', '#ef6c00'],
              hoverBorderWidth: 4,
              // Add explicit configuration
              hidden: false,
              parsing: false,
            },
          ],
        }

        this.occupancyChart = new Chart(ctx, {
          type: 'doughnut',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 14,
                    weight: '500',
                  },
                  generateLabels: function (chart) {
                    const data = chart.data
                    if (data.labels.length && data.datasets.length) {
                      return data.labels.map((label, i) => {
                        const value = data.datasets[0].data[i]
                        const percentage = (
                          (value / (occupiedStalls + vacantStalls)) *
                          100
                        ).toFixed(1)
                        return {
                          text: `${label}: ${value} (${percentage}%)`,
                          fillStyle: data.datasets[0].backgroundColor[i],
                          strokeStyle: data.datasets[0].borderColor[i],
                          pointStyle: 'circle',
                          hidden: false,
                          index: i,
                        }
                      })
                    }
                    return []
                  },
                },
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#4caf50',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: true,
                callbacks: {
                  label: function (context) {
                    const value = context.parsed
                    const total = context.dataset.data.reduce((a, b) => a + b, 0)
                    const percentage = ((value / total) * 100).toFixed(1)
                    return `${context.label}: ${value} stalls (${percentage}%)`
                  },
                },
              },
            },
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 2000,
              easing: 'easeInOutQuart',
            },
            hover: {
              animationDuration: 300,
            },
          },
        })
        console.log('✅ Occupancy chart created successfully')
      } catch (error) {
        console.error('❌ Error creating occupancy chart:', error)
      }
    },

    // Create collector performance chart
    createCollectorChart() {
      try {
        const ctx = this.$refs.collectorChart?.getContext('2d')
        if (!ctx) {
          console.warn('Collector chart canvas not found')
          return
        }

        console.log('Creating collector chart...')

        // Validate activeCollectors data
        if (!Array.isArray(this.activeCollectors) || this.activeCollectors.length === 0) {
          console.warn('No active collectors data available')
          return
        }

        const collectorData = this.activeCollectors
          .filter((collector) => collector && collector.name && collector.collections !== undefined)
          .map((collector) => ({
            name: collector.name.split(' ')[0] || 'Unknown', // First name only for cleaner display
            collections: collector.collections || 0,
            area: collector.area || 'Unknown',
          }))

        if (collectorData.length === 0) {
          console.warn('No valid collector data after filtering')
          return
        }

        this.collectorChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: collectorData.map((c) => c.name),
            datasets: [
              {
                label: 'Collections This Month',
                data: collectorData.map((c) => c.collections),
                backgroundColor: [
                  'rgba(33, 150, 243, 0.8)',
                  'rgba(76, 175, 80, 0.8)',
                  'rgba(255, 152, 0, 0.8)',
                  'rgba(156, 39, 176, 0.8)',
                  'rgba(244, 67, 54, 0.8)',
                ].slice(0, collectorData.length), // Only use as many colors as we have data
                borderColor: ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336'].slice(
                  0,
                  collectorData.length,
                ),
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
                // Add explicit configuration to prevent issues
                hidden: false,
                parsing: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#2196f3',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: false,
                callbacks: {
                  title: function (context) {
                    const index = context[0].dataIndex
                    return collectorData[index].name + ' (' + collectorData[index].area + ')'
                  },
                  label: function (context) {
                    return `Collections: ${context.parsed.y}`
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#666',
                  font: {
                    size: 12,
                    weight: '500',
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  color: '#666',
                  font: {
                    size: 12,
                  },
                  stepSize: 5,
                },
              },
            },
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart',
            },
            hover: {
              animationDuration: 300,
            },
          },
        })
        console.log('✅ Collector chart created successfully')
      } catch (error) {
        console.error('❌ Error creating collector chart:', error)
      }
    },

    // Create placeholder charts when Chart.js is not available
    createPlaceholderCharts() {
      const paymentCanvas = this.$refs.paymentChart
      const occupancyCanvas = this.$refs.occupancyChart

      if (paymentCanvas) {
        const ctx = paymentCanvas.getContext('2d')
        ctx.fillStyle = '#f5f5f5'
        ctx.fillRect(0, 0, paymentCanvas.width, paymentCanvas.height)
        ctx.fillStyle = '#666'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Payment Trends Chart', paymentCanvas.width / 2, paymentCanvas.height / 2)
      }

      if (occupancyCanvas) {
        const ctx = occupancyCanvas.getContext('2d')
        ctx.fillStyle = '#f5f5f5'
        ctx.fillRect(0, 0, occupancyCanvas.width, occupancyCanvas.height)
        ctx.fillStyle = '#666'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Occupancy Chart', occupancyCanvas.width / 2, occupancyCanvas.height / 2)
      }
    },

    // Utility methods for styling
    getStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'paid':
          return 'success'
        case 'pending':
          return 'warning'
        case 'overdue':
          return 'error'
        default:
          return 'grey'
      }
    },

    getStallStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success'
        case 'overdue':
          return 'error'
        case 'vacant':
          return 'grey'
        case 'maintenance':
          return 'warning'
        default:
          return 'grey'
      }
    },
  },
}
