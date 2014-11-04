Pigeon.set('global', {
			
	body: {
		checkout_session: {
			"id": "EC-71308063",
			"cart_id": "EC-71308063",
			"payer": {
				"payer_info": {
					"email": "buyer@paypal.com",
					"first_name": "Buyerfirst",
					"last_name": "BuyerLast",
					"payer_id": -788313859,
					"contact_phone_type": "", // "Mobile"
					"contact_phone_number": "", // "432-444-2343"
					"shipping_address": {
						"id": 448233,
						"recipient_name": "Buyerfirst BuyerLast",
						"line1": "2431 N First St",
						"city": "San Jose",
						"country_code": "US",
						"postal_code": "95131",
						"state": "CA",
						"default_address": true
					}
				},
				"funding_option": {
					"id": 8284370,
					"soft_descriptor": "Aries Merchant",
					"funding_sources": [
						{
							"id": 853765,
							"funding_method_type": "BALANCE",
							"name": "PayPal Balance",
							"amount": 500,
							"currency": "USD",
							"type": "BALANCE"
						},
						{
							"id": 883784,
							"funding_method_type": "BANK",
							"name": "Bank of America",
							"amount": 700,
							"currency": "USD",
							"type": "CHECKING",
							"masked_account_identifier": "4366"
						}
					],
					"backup_funding_sources": [
						{
							"funding_method_type": "CREDIT_CARD",
							"name": "MCARD",
							"amount": 700,
							"currency": "USD",
							"type": "MCARD",
							"masked_account_identifier": "8170"
						}
					]
				}
			},
			"payment_approved": false
		}
	},
	
	apis: [
					
		{
			method: 'GET',
			endpoint: '/v1/payments/carts/\\w+',
			
			body: {
				"create_time": 1384493398105,
				"intent": "SALE",
				"purchase_units": [
					{
						"amount": {
							"total": "1200",
							"currency": "USD",
							"details": {
								"shipping": "100",
								"subtotal": "1000",
								"tax": "100"
							}
						},
						"payee": {
							"name": "Aries awesome store",
							"service_email": "merchant@paypal.com",
							"service_phone": "+49 4467042435"
						}
					}
				]
			},
			
			options: [

			],
			
			middleware: function() {
				
			}
		},
		
		{
			method: 'GET',
			endpoint: '/v1/payments/carts/\\w+/application-data',
			
			body: {
				"return_url": "http://xotools.ca1.paypal.com/ectest/return.html",
				"cancel_url": "http://xotools.ca1.paypal.com/ectest/cancel.html",
				"show_items": true,
				"show_sub_total": false,
				"merchant_banner": {
					"brand_name": "Aries awesome store",
					"merchant_email": "merchant@paypal.com"
				},
				"shipping_address_not_required": false,
				"billing_address_consent_flag": false,
				"allow_change_shipping_address": true,
				"allow_change_payment_method": false,
				"phone_number_required": true
			},
			
			options: [

			],
			
			middleware: function() {
				
			}
		},
		
		{
			method: 'POST',
			endpoint: '/v1/payments/checkout-sessions',
			
			body: 'global.checkout_session',
			
			options: [

			],
			
			middleware: function() {
				
			}
		},
		
		{
			method: 'POST',
			endpoint: '/v1/payments/checkout-sessions/\\w+/payer/contact-phone',
			
			body: 'global.checkout_session',
			
			options: [

			],
			
			middleware: function() {
				global.checkout_session.payer.payer_info.contact_phone_type = request.body.contact_phone_type;
				global.checkout_session.payer.payer_info.contact_phone_number = request.body.contact_phone_number;
			}
		},
		
		{
			method: 'POST',
			endpoint: '/webapps/servicebridge/services/invoke/wurfl',
			
			body: {
				"serviceMethod": "getCapabilities",
				"data": {
					"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.69 Safari/537.36",
					"capabilities": [
						"is_wireless_device",
						"is_tablet"
					]
				},
				"calCorrelationId": "f75b28a04db6"
			},
			
			options: [

			],
			
			middleware: function() {
				
			}
		},
		
		{
			method: 'POST',
			endpoint: '/webapps/servicebridge/services/invoke/createtoken',
			
			body: {
				"details": {
					"actorIpAddress": "127.0.0.1",
					"authenticationStatusCode": "AUTH_STATUS_VALID",
					"authenticationReturnCode": "AUTH_RC_SUCCESS",
					"actorInfoVO": {
						"visitorId": "6124895493910140923",
						"actorIpAddr": "127.0.0.1",
						"actorId": "477986",
						"actorAuthType": 80,
						"actorAccountNumber": "1886046971331556350",
						"token": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48VXNlcl9Vc2VyQXV0aFRva2VuVk8gaWQ9IjEiPjxhY2NvdW50X251bWJlciB0eXBlPSJ1aW50NjQiPjE4ODYwNDY5NzEzMzE1NTYzNTA8L2FjY291bnRfbnVtYmVyPjxsb2dpbl9pZCB0eXBlPSJ1aW50NjQiPjQ3Nzk4NjwvbG9naW5faWQ+PHNlc3Npb25fbnVtYmVyIHR5cGU9InVpbnQzMiI+MTk0Nzg0MTc8L3Nlc3Npb25fbnVtYmVyPjxzZXNzaW9uX3RpbWUgdHlwZT0idWludDMyIj4xMzgxMjkwMjYyPC9zZXNzaW9uX3RpbWU+PGF1dGhfdHlwZSB0eXBlPSJzaW50OCI+ODA8L2F1dGhfdHlwZT48c2Vzc2lvbl9pZCB0eXBlPSJTdHJpbmciPlNrVGNwQVZSU0FJQTwvc2Vzc2lvbl9pZD48YXV0aF9jcmVkZW50aWFsIHR5cGU9InNpbnQ4Ij44MDwvYXV0aF9jcmVkZW50aWFsPjxhdXRoX21vZGlmaWVyX2ZsYWdzIHR5cGU9InVpbnQzMiI+MTwvYXV0aF9tb2RpZmllcl9mbGFncz48YXV0aF9sZXZlbCB0eXBlPSJ1aW50MzIiPjA8L2F1dGhfbGV2ZWw+PHRva2VuX3N0YXR1cyB0eXBlPSJzaW50OCI+ODk8L3Rva2VuX3N0YXR1cz48Y2hhbm5lbCB0eXBlPSJTdHJpbmciPldFQjwvY2hhbm5lbD48c2VjdXJpdHlfbmFtZXNwYWNlIHR5cGU9IlN0cmluZyI+PC9zZWN1cml0eV9uYW1lc3BhY2U+PC9Vc2VyX1VzZXJBdXRoVG9rZW5WTz4=",
						"tokenType": 0,
						"actorSessionId": "SkTcpAVRSAIA",
						"guid": "0",
						"actorType": 2,
						"actorAuthCredential": 80,
						"entryPoint": "",
						"actorRiskDetails": {}
					},
					"riskPassBack": {
						"className": "Risk::RiskAuthResultsVO",
						"serializationForm": 66,
						"serializedData": "Vk8BAQAXUmlzazo6Umlza0F1dGhSZXN1bHRzVk8DAA1yaXNrX3Jlc3BvbnNlAQYAAAUC"
					}
				},
				"authorities": [
					{
						"authority": "ROLE_PRIMARY_USER_LOGIN"
					}
				],
				"authenticated": true,
				"principal": {
					"password": "********",
					"username": "xlai@paypal.com",
					"authorities": [
						{
							"authority": "ROLE_PRIMARY_USER_LOGIN"
						}
					],
					"accountNonExpired": true,
					"accountNonLocked": true,
					"credentialsNonExpired": true,
					"enabled": true,
					"accountNumber": "1886046971331556350",
					"country": {
						"countryCode": "US",
						"englishName": "United States",
						"allMetaData": {}
					},
					"timeZone": {
						"timeZoneCode": "America/Los_Angeles",
						"allMetaData": {}
					},
					"legalEntity": "73",
					"actorInfoVO": {
						"visitorId": "6124895493910140923",
						"actorIpAddr": "127.0.0.1",
						"actorId": "477986",
						"actorAuthType": 80,
						"actorAccountNumber": "1886046971331556350",
						"token": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48VXNlcl9Vc2VyQXV0aFRva2VuVk8gaWQ9IjEiPjxhY2NvdW50X251bWJlciB0eXBlPSJ1aW50NjQiPjE4ODYwNDY5NzEzMzE1NTYzNTA8L2FjY291bnRfbnVtYmVyPjxsb2dpbl9pZCB0eXBlPSJ1aW50NjQiPjQ3Nzk4NjwvbG9naW5faWQ+PHNlc3Npb25fbnVtYmVyIHR5cGU9InVpbnQzMiI+MTk0Nzg0MTc8L3Nlc3Npb25fbnVtYmVyPjxzZXNzaW9uX3RpbWUgdHlwZT0idWludDMyIj4xMzgxMjkwMjYyPC9zZXNzaW9uX3RpbWU+PGF1dGhfdHlwZSB0eXBlPSJzaW50OCI+ODA8L2F1dGhfdHlwZT48c2Vzc2lvbl9pZCB0eXBlPSJTdHJpbmciPlNrVGNwQVZSU0FJQTwvc2Vzc2lvbl9pZD48YXV0aF9jcmVkZW50aWFsIHR5cGU9InNpbnQ4Ij44MDwvYXV0aF9jcmVkZW50aWFsPjxhdXRoX21vZGlmaWVyX2ZsYWdzIHR5cGU9InVpbnQzMiI+MTwvYXV0aF9tb2RpZmllcl9mbGFncz48YXV0aF9sZXZlbCB0eXBlPSJ1aW50MzIiPjA8L2F1dGhfbGV2ZWw+PHRva2VuX3N0YXR1cyB0eXBlPSJzaW50OCI+ODk8L3Rva2VuX3N0YXR1cz48Y2hhbm5lbCB0eXBlPSJTdHJpbmciPldFQjwvY2hhbm5lbD48c2VjdXJpdHlfbmFtZXNwYWNlIHR5cGU9IlN0cmluZyI+PC9zZWN1cml0eV9uYW1lc3BhY2U+PC9Vc2VyX1VzZXJBdXRoVG9rZW5WTz4=",
						"tokenType": 0,
						"actorSessionId": "SkTcpAVRSAIA",
						"guid": "0",
						"actorType": 2,
						"actorAuthCredential": 80,
						"entryPoint": "",
						"actorRiskDetails": {}
					},
					"firstName": "Yevgeni",
					"lastName": "Fritz",
					"encryptedAccountNumber": "HYN2RY66J24P8",
					"youthAccount": false,
					"accountTags": [
						{
							"name": "IS_VERIFIED",
							"value": "VERIFIED",
							"registered": true
						}
					],
					"legalCountry": "US",
					"email": "xlai@paypal.com",
					"oldUserReadService": "com.paypal.infra.user.LoadByAccountBackwardsCompatibility",
					"accountClosed": false,
					"verified": true,
					"restricted": false
				},
				"credentials": {
					"data": "/jPrS7qVLBoiSwcAAAAAAJE3KQEW0VRSAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
				},
				"loggedIn": true,
				"name": "xlai@paypal.com"
			},
			
			options: [

			],
			
			middleware: function() {
				
			}
		},
		
		{
			method: 'POST',
			endpoint: '/webapps/servicebridge/services/invoke/authtoken',
			
			body: {
				"details": {
					"actorIpAddress": "127.0.0.1",
					"authenticationStatusCode": "AUTH_STATUS_VALID",
					"authenticationReturnCode": "AUTH_RC_SUCCESS",
					"actorInfoVO": {
						"visitorId": "6124895493910140923",
						"actorIpAddr": "127.0.0.1",
						"actorId": "477986",
						"actorAuthType": 80,
						"actorAccountNumber": "1886046971331556350",
						"token": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48VXNlcl9Vc2VyQXV0aFRva2VuVk8gaWQ9IjEiPjxhY2NvdW50X251bWJlciB0eXBlPSJ1aW50NjQiPjE4ODYwNDY5NzEzMzE1NTYzNTA8L2FjY291bnRfbnVtYmVyPjxsb2dpbl9pZCB0eXBlPSJ1aW50NjQiPjQ3Nzk4NjwvbG9naW5faWQ+PHNlc3Npb25fbnVtYmVyIHR5cGU9InVpbnQzMiI+MTk0Nzg0MTc8L3Nlc3Npb25fbnVtYmVyPjxzZXNzaW9uX3RpbWUgdHlwZT0idWludDMyIj4xMzgxMjkwMjYyPC9zZXNzaW9uX3RpbWU+PGF1dGhfdHlwZSB0eXBlPSJzaW50OCI+ODA8L2F1dGhfdHlwZT48c2Vzc2lvbl9pZCB0eXBlPSJTdHJpbmciPlNrVGNwQVZSU0FJQTwvc2Vzc2lvbl9pZD48YXV0aF9jcmVkZW50aWFsIHR5cGU9InNpbnQ4Ij44MDwvYXV0aF9jcmVkZW50aWFsPjxhdXRoX21vZGlmaWVyX2ZsYWdzIHR5cGU9InVpbnQzMiI+MTwvYXV0aF9tb2RpZmllcl9mbGFncz48YXV0aF9sZXZlbCB0eXBlPSJ1aW50MzIiPjA8L2F1dGhfbGV2ZWw+PHRva2VuX3N0YXR1cyB0eXBlPSJzaW50OCI+ODk8L3Rva2VuX3N0YXR1cz48Y2hhbm5lbCB0eXBlPSJTdHJpbmciPldFQjwvY2hhbm5lbD48c2VjdXJpdHlfbmFtZXNwYWNlIHR5cGU9IlN0cmluZyI+PC9zZWN1cml0eV9uYW1lc3BhY2U+PC9Vc2VyX1VzZXJBdXRoVG9rZW5WTz4=",
						"tokenType": 0,
						"actorSessionId": "SkTcpAVRSAIA",
						"guid": "0",
						"actorType": 2,
						"actorAuthCredential": 80,
						"entryPoint": "",
						"actorRiskDetails": {}
					},
					"riskPassBack": {
						"className": "Risk::RiskAuthResultsVO",
						"serializationForm": 66,
						"serializedData": "Vk8BAQAXUmlzazo6Umlza0F1dGhSZXN1bHRzVk8DAA1yaXNrX3Jlc3BvbnNlAQYAAAUC"
					}
				},
				"authorities": [
					{
						"authority": "ROLE_PRIMARY_USER_LOGIN"
					}
				],
				"authenticated": true,
				"principal": {
					"password": "********",
					"username": "xlai@paypal.com",
					"authorities": [
						{
							"authority": "ROLE_PRIMARY_USER_LOGIN"
						}
					],
					"accountNonExpired": true,
					"accountNonLocked": true,
					"credentialsNonExpired": true,
					"enabled": true,
					"accountNumber": "1886046971331556350",
					"country": {
						"countryCode": "US",
						"englishName": "United States",
						"allMetaData": {}
					},
					"timeZone": {
						"timeZoneCode": "America/Los_Angeles",
						"allMetaData": {}
					},
					"legalEntity": "73",
					"actorInfoVO": {
						"visitorId": "6124895493910140923",
						"actorIpAddr": "127.0.0.1",
						"actorId": "477986",
						"actorAuthType": 80,
						"actorAccountNumber": "1886046971331556350",
						"token": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48VXNlcl9Vc2VyQXV0aFRva2VuVk8gaWQ9IjEiPjxhY2NvdW50X251bWJlciB0eXBlPSJ1aW50NjQiPjE4ODYwNDY5NzEzMzE1NTYzNTA8L2FjY291bnRfbnVtYmVyPjxsb2dpbl9pZCB0eXBlPSJ1aW50NjQiPjQ3Nzk4NjwvbG9naW5faWQ+PHNlc3Npb25fbnVtYmVyIHR5cGU9InVpbnQzMiI+MTk0Nzg0MTc8L3Nlc3Npb25fbnVtYmVyPjxzZXNzaW9uX3RpbWUgdHlwZT0idWludDMyIj4xMzgxMjkwMjYyPC9zZXNzaW9uX3RpbWU+PGF1dGhfdHlwZSB0eXBlPSJzaW50OCI+ODA8L2F1dGhfdHlwZT48c2Vzc2lvbl9pZCB0eXBlPSJTdHJpbmciPlNrVGNwQVZSU0FJQTwvc2Vzc2lvbl9pZD48YXV0aF9jcmVkZW50aWFsIHR5cGU9InNpbnQ4Ij44MDwvYXV0aF9jcmVkZW50aWFsPjxhdXRoX21vZGlmaWVyX2ZsYWdzIHR5cGU9InVpbnQzMiI+MTwvYXV0aF9tb2RpZmllcl9mbGFncz48YXV0aF9sZXZlbCB0eXBlPSJ1aW50MzIiPjA8L2F1dGhfbGV2ZWw+PHRva2VuX3N0YXR1cyB0eXBlPSJzaW50OCI+ODk8L3Rva2VuX3N0YXR1cz48Y2hhbm5lbCB0eXBlPSJTdHJpbmciPldFQjwvY2hhbm5lbD48c2VjdXJpdHlfbmFtZXNwYWNlIHR5cGU9IlN0cmluZyI+PC9zZWN1cml0eV9uYW1lc3BhY2U+PC9Vc2VyX1VzZXJBdXRoVG9rZW5WTz4=",
						"tokenType": 0,
						"actorSessionId": "SkTcpAVRSAIA",
						"guid": "0",
						"actorType": 2,
						"actorAuthCredential": 80,
						"entryPoint": "",
						"actorRiskDetails": {}
					},
					"firstName": "Yevgeni",
					"lastName": "Fritz",
					"encryptedAccountNumber": "HYN2RY66J24P8",
					"youthAccount": false,
					"accountTags": [
						{
							"name": "IS_VERIFIED",
							"value": "VERIFIED",
							"registered": true
						}
					],
					"legalCountry": "US",
					"email": "xlai@paypal.com",
					"oldUserReadService": "com.paypal.infra.user.LoadByAccountBackwardsCompatibility",
					"accountClosed": false,
					"verified": true,
					"restricted": false
				},
				"credentials": {
					"data": "/jPrS7qVLBoiSwcAAAAAAJE3KQEW0VRSAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
				},
				"loggedIn": true,
				"name": "xlai@paypal.com"
			},
			
			options: [

			],
			
			middleware: function() {
				
			}
		},
		
		{
			method: 'GET',
			endpoint: '',
			
			body: {
				
			},
			
			options: [

			],
			
			middleware: function() {
				
			}
		},
	]
});



/*
 
 					options: [
						{
							key: 'contingency',
							
							values: [
								{
									content: "'addCard'",
									selected: true
								},
								{
									content: "'updateCard'"
								},
							]
						},
						
						{
							key: 'country',
							
							values: [
								{
									content: "'US'"
								},
								{
									content: "'CA'",
									selected: true
								},
								{
									content: "'GB'"
								},
							]
						}
					],
 
 */
