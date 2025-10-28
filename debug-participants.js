// Debug script to test the participants API
import participantsService from './src/services/participantsService.js'

async function debugParticipantsAPI() {
  console.log('🔍 Starting participants API debug...')

  try {
    // Test 1: Check general API connection
    console.log('\n📡 Test 1: Testing general participants API...')
    const generalTest = await participantsService.testConnection()
    console.log('General API result:', generalTest)

    // Test 2: Try to get participants for a specific stall
    console.log('\n📡 Test 2: Testing participants by stall...')
    // Use a stall ID that likely exists (you can change this)
    const stallTest = await participantsService.getParticipantsByStall(1)
    console.log('Stall participants result:', stallTest)
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Run the debug
debugParticipantsAPI()
