<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 primary white--text">
        <v-icon left class="mr-2">mdi-account-plus</v-icon>
        {{ branch?.manager_name ? 'Change' : 'Assign' }} Branch Manager
      </v-card-title>

      <v-form ref="form" v-model="valid">
        <v-card-text class="pt-4">
          <v-container>
            <!-- Branch Info -->
            <v-row v-if="branch">
              <v-col cols="12">
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <h4 class="text-h6 mb-2">{{ branch.branch_name }}</h4>
                    <p class="text-body-2 text--secondary mb-1">
                      <v-icon small class="mr-1">mdi-map-marker</v-icon>
                      {{ branch.area }} - {{ branch.location }}
                    </p>
                    <p v-if="branch.manager_name" class="text-body-2 text--secondary">
                      <v-icon small class="mr-1">mdi-account-tie</v-icon>
                      Current Manager: {{ branch.manager_name }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Manager Form -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.first_name"
                  label="First Name *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  placeholder="Enter first name"
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.last_name"
                  label="Last Name *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  placeholder="Enter last name"
                />
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model="formData.manager_username"
                  label="Username *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-circle"
                  placeholder="Enter username"
                />
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model="formData.manager_password"
                  label="Password *"
                  type="password"
                  :rules="[rules.required, rules.minLength]"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock"
                  placeholder="Enter password"
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email Address"
                  :rules="[rules.email]"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  placeholder="manager@example.com"
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.contact_number"
                  label="Contact Number"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  placeholder="+63 XXX XXX XXXX"
                />
              </v-col>
              
              <v-col cols="12">
                <v-select
                  v-model="formData.status"
                  label="Status *"
                  :items="statusOptions"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-check-circle"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="grey"
            variant="outlined"
            @click="closeDialog"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="assignManager"
            :loading="loading"
            :disabled="!valid"
          >
            {{ branch?.manager_name ? 'Update' : 'Assign' }} Manager
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AssignManagerDialog',
  emits: ['update:modelValue', 'manager-assigned'],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    branch: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      formData: {
        first_name: '',
        last_name: '',
        manager_username: '',
        manager_password: '',
        email: '',
        contact_number: '',
        status: 'Active',
      },
      statusOptions: [
        { title: 'Active', value: 'Active' },
        { title: 'Inactive', value: 'Inactive' },
      ],
      rules: {
        required: (value) => !!value || 'This field is required',
        minLength: (value) => !value || value.length >= 6 || 'Password must be at least 6 characters',
        email: (value) => {
          if (!value) return true
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) || 'Enter a valid email address'
        },
      },
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.resetForm()
      }
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        first_name: '',
        last_name: '',
        manager_username: '',
        manager_password: '',
        email: '',
        contact_number: '',
        status: 'Active',
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },

    closeDialog() {
      this.dialog = false
    },

    async assignManager() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.loading = true
      try {
        const payload = {
          ...this.formData,
          branch_id: this.branch.branch_id,
        }

        const response = await axios.post('http://localhost:3001/api/admin/branch-managers', payload, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        })

        if (response.data && response.data.success) {
          // Update branch with manager info
          const updatedBranch = {
            ...this.branch,
            manager_name: `${this.formData.first_name} ${this.formData.last_name}`,
            manager_assigned: true,
          }
          
          this.$emit('manager-assigned', updatedBranch)
          this.closeDialog()
        }
      } catch (error) {
        console.error('Error assigning manager:', error)
        // Handle error - could emit an error event or show a snackbar
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.v-card-title {
  background: linear-gradient(45deg, #1976d2, #1565c0);
}

.white--text {
  color: white !important;
}

.text--secondary {
  color: rgba(0, 0, 0, 0.6) !important;
}
</style>