// Test configuration for minimal version
export const minimalTestConfig = {
  modules: ['Universe', 'Soul', 'Flow'],
  
  testUsers: [
    {
      name: 'NewUser',
      vibration: 50,
      canAccess: ['Universe', 'Soul'],
      cannotAccess: ['Flow']
    },
    {
      name: 'ActiveUser',
      vibration: 75,
      canAccess: ['Universe', 'Soul', 'Flow'],
      cannotAccess: []
    }
  ],
  
  vibrationRequirements: {
    Universe: 0,
    Soul: 0,
    Flow: 60
  },
  
  testProjects: [
    {
      title: 'My First Album',
      description: 'Testing the Flow module',
      requiredVibration: 60
    }
  ]
};
