<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <div>
      <!-- Main Content -->
      <v-main>
        <v-container fluid class="main-content">
          <v-row>
            <v-col cols="12">
              <!-- Key Metrics Cards -->
              <v-row class="mb-6">
                <v-col cols="12" sm="6" md="3">
                  <v-card class="metric-card" elevation="2">
                    <v-card-text class="metric-content">
                      <div class="metric-title">Total Stalls</div>
                      <div class="metric-body">
                        <v-icon size="48" color="primary" class="metric-icon"
                          >mdi-store</v-icon
                        >
                        <div class="metric-number">{{ totalStalls }}</div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="metric-card" elevation="2">
                    <v-card-text class="metric-content">
                      <div class="metric-title">Active Stallholders</div>
                      <div class="metric-body">
                        <v-icon size="48" color="success" class="metric-icon"
                          >mdi-account-group</v-icon
                        >
                        <div class="metric-number">{{ totalStallholders }}</div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="metric-card" elevation="2">
                    <v-card-text class="metric-content">
                      <div class="metric-title">Total Payments</div>
                      <div class="metric-body">
                        <v-icon size="48" color="warning" class="metric-icon"
                          >mdi-currency-php</v-icon
                        >
                        <div class="metric-number">
                          ₱{{ totalPayments.toLocaleString() }}
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="metric-card" elevation="2">
                    <v-card-text class="metric-content">
                      <div class="metric-title">Active Collectors</div>
                      <div class="metric-body">
                        <v-icon size="48" color="info" class="metric-icon"
                          >mdi-account-tie</v-icon
                        >
                        <div class="metric-number">{{ totalCollectors }}</div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Charts Row -->
              <v-row class="mb-6">
                <!-- Payment Trends Chart -->
                <v-col cols="12" lg="4">
                  <v-card elevation="2" class="chart-card">
                    <v-card-title class="chart-title">
                      <v-icon left color="primary">mdi-chart-line</v-icon>
                      Payment Trends (Last 7 Days)
                    </v-card-title>
                    <v-card-text>
                      <div class="chart-container">
                        <canvas
                          ref="paymentChart"
                          class="chart-canvas"
                          width="400"
                          height="300"
                          style="border: 1px solid #e0e0e0; border-radius: 8px"
                        ></canvas>
                        <div v-if="!paymentChart" class="chart-placeholder">
                          <v-icon size="48" color="grey-lighten-1">mdi-chart-line</v-icon>
                          <p class="text-grey-600 mt-2">Loading chart...</p>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Stall Occupancy Chart -->
                <v-col cols="12" lg="4">
                  <v-card elevation="2" class="chart-card">
                    <v-card-title class="chart-title">
                      <v-icon left color="success">mdi-chart-donut</v-icon>
                      Stall Occupancy Status
                    </v-card-title>
                    <v-card-text>
                      <div class="chart-container">
                        <canvas
                          ref="occupancyChart"
                          class="chart-canvas"
                          width="400"
                          height="300"
                          style="border: 1px solid #e0e0e0; border-radius: 8px"
                        ></canvas>
                        <div v-if="!occupancyChart" class="chart-placeholder">
                          <v-icon size="48" color="grey-lighten-1"
                            >mdi-chart-donut</v-icon
                          >
                          <p class="text-grey-600 mt-2">Loading chart...</p>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Collector Performance Chart -->
                <v-col cols="12" lg="4">
                  <v-card elevation="2" class="chart-card">
                    <v-card-title class="chart-title">
                      <v-icon left color="info">mdi-chart-bar</v-icon>
                      Collector Performance
                    </v-card-title>
                    <v-card-text>
                      <div class="chart-container">
                        <canvas
                          ref="collectorChart"
                          class="chart-canvas"
                          width="400"
                          height="300"
                          style="border: 1px solid #e0e0e0; border-radius: 8px"
                        ></canvas>
                        <div v-if="!collectorChart" class="chart-placeholder">
                          <v-icon size="48" color="grey-lighten-1">mdi-chart-bar</v-icon>
                          <p class="text-grey-600 mt-2">Loading chart...</p>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Data Tables Row -->
              <v-row>
                <!-- Recent Payments -->
                <v-col cols="12" lg="6">
                  <v-card elevation="2" class="data-table-card">
                    <v-card-title class="table-header">
                      <v-icon left color="warning">mdi-credit-card</v-icon>
                      Recent Payments
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-table class="custom-table">
                        <thead>
                          <tr>
                            <th>Stallholder</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="payment in recentPayments" :key="payment.id">
                            <td class="font-weight-medium">{{ payment.stallholder }}</td>
                            <td class="text-success font-weight-bold">
                              ₱{{ payment.amount.toLocaleString() }}
                            </td>
                            <td class="text-grey-600">{{ payment.date }}</td>
                            <td>
                              <v-chip
                                :color="getStatusColor(payment.status)"
                                size="small"
                                variant="flat"
                              >
                                {{ payment.status }}
                              </v-chip>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Active Collectors -->
                <v-col cols="12" lg="6">
                  <v-card elevation="2" class="data-table-card">
                    <v-card-title class="table-header">
                      <v-icon left color="info">mdi-account-tie</v-icon>
                      Active Collectors
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-table class="custom-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Area</th>
                            <th>Collections</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="collector in activeCollectors" :key="collector.id">
                            <td class="font-weight-medium">{{ collector.name }}</td>
                            <td class="text-grey-600">{{ collector.area }}</td>
                            <td class="text-primary font-weight-bold">
                              {{ collector.collections }}
                            </td>
                            <td>
                              <v-chip
                                :color="
                                  collector.status === 'Active' ? 'success' : 'warning'
                                "
                                size="small"
                                variant="flat"
                              >
                                {{ collector.status }}
                              </v-chip>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Stall Overview Row -->
              <v-row class="mt-6">
                <v-col cols="12">
                  <v-card elevation="2" class="data-table-card">
                    <v-card-title class="table-header">
                      <v-icon left color="primary">mdi-store</v-icon>
                      Stall Overview
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-table class="custom-table">
                        <thead>
                          <tr>
                            <th>Stall ID</th>
                            <th>Stallholder</th>
                            <th>Location</th>
                            <th>Monthly Fee</th>
                            <th>Last Payment</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="stall in stallOverview" :key="stall.id">
                            <td class="font-weight-bold text-primary">
                              {{ stall.stallId }}
                            </td>
                            <td class="font-weight-medium">{{ stall.stallholder }}</td>
                            <td class="text-grey-600">{{ stall.location }}</td>
                            <td class="text-success font-weight-bold">
                              ₱{{ stall.monthlyFee.toLocaleString() }}
                            </td>
                            <td class="text-grey-600">{{ stall.lastPayment }}</td>
                            <td>
                              <v-chip
                                :color="getStallStatusColor(stall.status)"
                                size="small"
                                variant="flat"
                              >
                                {{ stall.status }}
                              </v-chip>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script src="./Dashboard.js"></script>
<style scoped src="./Dashboard.css"></style>
