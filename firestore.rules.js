rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidTransaction(data) {
      return data.amount is number && data.amount > 0 &&
             data.type in ['expense', 'income'] &&
             data.date is string &&
             data.currency is string &&
             data.merchant is string;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /transactions/{transactionId} {
        allow read, delete: if isOwner(userId);
        allow create, update: if isOwner(userId) && isValidTransaction(request.resource.data);
      }

      match /categories/{categoryId} {
        allow read, write: if isOwner(userId);
      }

      match /merchantRules/{ruleId} {
        allow read, write: if isOwner(userId);
      }

      match /budgets/{budgetId} {
        allow read, write: if isOwner(userId);
      }

      match /subscriptions/{subId} {
        allow read, write: if isOwner(userId);
      }

      match /settings/{docId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}