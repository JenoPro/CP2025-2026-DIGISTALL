import axios from 'axios'

// eslint-disable-next-line no-undef
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

class ParticipantsService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${API_BASE_URL}/api/applicants`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          sessionStorage.removeItem('authToken')
          sessionStorage.removeItem('currentUser')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      },
    )
  }

  /**
   * Get all participants (approved applicants with active stalls)
   * @returns {Promise} API response with participants data
   */
  async getAllParticipants() {
    try {
      const response = await this.apiClient.get('/participants')
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        summary: response.data.summary,
      }
    } catch (error) {
      console.error('Error fetching all participants:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Test the participants API connection
   * @returns {Promise} Test result
   */
  async testConnection() {
    try {
      console.log('🔍 Testing participants API connection...')
      const response = await this.apiClient.get('/participants')
      console.log('✅ Participants API is working:', response.data)
      return {
        success: true,
        message: 'API connection successful',
        data: response.data,
      }
    } catch (error) {
      console.error('❌ Participants API connection failed:', error)
      return this.handleError(error)
    }
  }

  /**
   * Get participants by branch
   * @param {string} branchName - Name of the branch
   * @param {string} status - Optional status filter
   * @returns {Promise} API response with participants data
   */
  async getParticipantsByBranch(branchName, status = null) {
    try {
      let url = `/participants/branch/${encodeURIComponent(branchName)}`
      if (status) {
        url += `?status=${encodeURIComponent(status)}`
      }

      const response = await this.apiClient.get(url)
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        branch: response.data.branch,
        filters: response.data.filters,
      }
    } catch (error) {
      console.error('Error fetching participants by branch:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get participants by stall ID
   * @param {number|string} stallId - ID of the stall
   * @returns {Promise} API response with participants data
   */
  async getParticipantsByStall(stallId) {
    try {
      console.log(`🔍 Fetching participants for stall ID: ${stallId}`)
      const response = await this.apiClient.get(`/participants/stall/${stallId}`)

      console.log('✅ Participants API response:', response.data)

      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        stallInfo: response.data.stallInfo,
        statusSummary: response.data.statusSummary,
      }
    } catch (error) {
      console.error(`❌ Error fetching participants for stall ${stallId}:`, error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      })
      throw this.handleError(error)
    }
  }

  /**
   * Get participants for raffle stalls (approved participants only)
   * @param {number|string} stallId - ID of the raffle stall
   * @returns {Promise} API response with raffle participants
   */
  async getRaffleParticipants(stallId) {
    try {
      console.log(`🎲 Getting raffle participants for stall ${stallId}`)

      // First check if we can reach the API at all
      const baseURL = this.apiClient.defaults.baseURL
      console.log(`🔗 API Base URL: ${baseURL}`)
      console.log(`🔑 Auth Token: ${sessionStorage.getItem('authToken') ? 'Present' : 'Missing'}`)

      const response = await this.getParticipantsByStall(stallId)
      if (response.success) {
        // Filter only approved participants for raffles
        const raffleParticipants = response.data
          .filter((participant) => participant.applicationInfo.status === 'Approved')
          .map((participant) => ({
            user_id: participant.participantId,
            participant_id: participant.participantId,
            name: participant.personalInfo.fullName,
            email: participant.personalInfo.email,
            contact: participant.personalInfo.contactNumber,
            business_name: participant.businessInfo.name,
            business_type: participant.businessInfo.type,
            joined_at: participant.applicationInfo.applicationDate,
            status: 'Participating', // Default status for raffle participants
            mobile_access: participant.mobileAccess.hasCredentials,
          }))

        console.log(`✅ Found ${raffleParticipants.length} approved participants for raffle`)
        return {
          success: true,
          data: raffleParticipants,
          count: raffleParticipants.length,
          stallInfo: response.stallInfo,
        }
      }
      return response
    } catch (error) {
      console.error('❌ Error fetching raffle participants:', error)

      // Provide more specific error information
      if (error.message?.includes('Network Error') || error.code === 'NETWORK_ERROR') {
        console.error('🌐 Network Error: Backend server might not be running')
        console.error('🔧 Check if your backend server is running on the correct port')
      } else if (error.status === 404) {
        console.error('🔍 404 Error: Participants endpoint not found')
        console.error('🔧 Check if the /api/applicants/participants route exists in your backend')
      } else if (error.status === 401) {
        console.error('🔐 401 Error: Authentication failed')
        console.error('🔧 Check if the auth token is valid')
      }

      throw this.handleError(error)
    }
  }

  /**
   * Get bidders for auction stalls (approved participants only)
   * @param {number|string} stallId - ID of the auction stall
   * @returns {Promise} API response with auction bidders
   */
  async getAuctionBidders(stallId) {
    try {
      const response = await this.getParticipantsByStall(stallId)
      if (response.success) {
        // Filter only approved participants for auctions and transform to bidders
        const auctionBidders = response.data
          .filter((participant) => participant.applicationInfo.status === 'Approved')
          .map((participant, index) => {
            // Mock bidding data - in real implementation, this would come from bid records
            const basePrice = response.stallInfo?.rentalPrice || 1000 // Default base price if not available
            const mockBidAmount = basePrice + Math.random() * 1000 + index * 100

            return {
              bidder_id: participant.participantId,
              participant_id: participant.participantId,
              bidder_name: participant.personalInfo.fullName,
              name: participant.personalInfo.fullName,
              email: participant.personalInfo.email,
              contact: participant.personalInfo.contactNumber,
              business_name: participant.businessInfo.name,
              business_type: participant.businessInfo.type,
              bid_amount: Math.round(mockBidAmount),
              bid_time: participant.applicationInfo.applicationDate,
              status: index === 0 ? 'Highest Bidder' : 'Bidding', // First participant is highest bidder
              mobile_access: participant.mobileAccess.hasCredentials,
            }
          })
          .sort((a, b) => b.bid_amount - a.bid_amount) // Sort by bid amount descending

        return {
          success: true,
          data: auctionBidders,
          count: auctionBidders.length,
          stallInfo: response.stallInfo,
          highest_bid:
            auctionBidders.length > 0
              ? auctionBidders[0].bid_amount
              : response.stallInfo?.rentalPrice || 1000, // Default fallback price
          highest_bidder: auctionBidders.length > 0 ? auctionBidders[0].bidder_name : null,
        }
      }
      return response
    } catch (error) {
      console.error('Error fetching auction bidders:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors and format them consistently
   * @param {Error} error - The error object
   * @returns {Object} Formatted error object
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        details: error.response.data,
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: 'Network error - please check your connection',
        status: null,
        details: null,
      }
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        status: null,
        details: null,
      }
    }
  }
}

// Export a singleton instance
export default new ParticipantsService()
