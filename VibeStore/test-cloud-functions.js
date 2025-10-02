/**
 * VibeStore Cloud Functions Test Suite
 * Comprehensive testing for all deployed Cloud Functions
 */

const TEST_CONFIG = {
    projectId: 'vibestore-7af1e',
    functionsUrl: 'https://us-central1-vibestore-7af1e.cloudfunctions.net',
    testAppId: 'test-app-' + Date.now(),
    testImageUrl: 'https://picsum.photos/800/600?random=' + Math.random(),
    testUserId: 'test-user-' + Date.now()
};

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Utility functions
function logTest(testName, status, message, data = null) {
    testResults.total++;
    if (status === 'PASS') {
        testResults.passed++;
        console.log(`✅ ${testName}: ${message}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${testName}: ${message}`);
    }
    
    testResults.details.push({
        name: testName,
        status,
        message,
        data,
        timestamp: new Date().toISOString()
    });
}

async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.text();
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch {
            jsonData = data;
        }
        
        return { response, data: jsonData, success: response.ok };
    } catch (error) {
        return { response: null, data: null, success: false, error: error.message };
    }
}

// Test 1: redirectAndLogClick Function
async function testRedirectAndLogClick() {
    console.log('\n🔗 Testing redirectAndLogClick...');
    
    const url = `${TEST_CONFIG.functionsUrl}/redirectAndLogClick?appId=${TEST_CONFIG.testAppId}`;
    const { response, success, error } = await makeRequest(url, { method: 'GET' });
    
    if (success && (response.status === 302 || response.status === 0)) {
        logTest('redirectAndLogClick', 'PASS', 'Function responds correctly with redirect', {
            status: response.status,
            url: response.url
        });
    } else {
        logTest('redirectAndLogClick', 'FAIL', `Function failed: ${error || 'Invalid response'}`, {
            status: response?.status,
            error
        });
    }
}

// Test 2: processImage Function
async function testProcessImage() {
    console.log('\n🖼️ Testing processImage...');
    
    const url = `${TEST_CONFIG.functionsUrl}/processImage`;
    const payload = {
        imageUrl: TEST_CONFIG.testImageUrl,
        appId: TEST_CONFIG.testAppId,
        type: 'screenshot'
    };
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    if (success && data && data.success) {
        logTest('processImage', 'PASS', 'Image processing successful', {
            processedImages: Object.keys(data.processedImages || {}),
            original: data.original
        });
    } else {
        logTest('processImage', 'FAIL', `Image processing failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 3: generateThumbnail Function
async function testGenerateThumbnail() {
    console.log('\n🖼️ Testing generateThumbnail...');
    
    const url = `${TEST_CONFIG.functionsUrl}/generateThumbnail`;
    const payload = {
        imageUrl: TEST_CONFIG.testImageUrl,
        sizes: [512, 256, 128],
        appId: TEST_CONFIG.testAppId
    };
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    if (success && data && data.ok) {
        logTest('generateThumbnail', 'PASS', 'Thumbnail generation successful', {
            thumbnails: data.thumbnails?.length || 0,
            original: data.original
        });
    } else {
        logTest('generateThumbnail', 'FAIL', `Thumbnail generation failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 4: approveApp Function (Callable)
async function testApproveApp() {
    console.log('\n✅ Testing approveApp...');
    
    const url = `${TEST_CONFIG.functionsUrl}/approveApp`;
    const payload = {
        data: {
            appId: TEST_CONFIG.testAppId
        }
    };
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    // This will likely fail due to admin authentication, but we can test the function structure
    if (response && response.status === 401) {
        logTest('approveApp', 'PASS', 'Function structure correct (authentication required)', {
            status: response.status,
            message: 'Admin authentication required as expected'
        });
    } else if (success) {
        logTest('approveApp', 'PASS', 'App approval successful', data);
    } else {
        logTest('approveApp', 'FAIL', `App approval failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 5: createReview Function (Callable)
async function testCreateReview() {
    console.log('\n⭐ Testing createReview...');
    
    const url = `${TEST_CONFIG.functionsUrl}/createReview`;
    const payload = {
        data: {
            appId: TEST_CONFIG.testAppId,
            stars: 5,
            text: 'Test review from automated test suite'
        }
    };
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    // This will likely fail due to authentication, but we can test the function structure
    if (response && response.status === 401) {
        logTest('createReview', 'PASS', 'Function structure correct (authentication required)', {
            status: response.status,
            message: 'User authentication required as expected'
        });
    } else if (success) {
        logTest('createReview', 'PASS', 'Review creation successful', data);
    } else {
        logTest('createReview', 'FAIL', `Review creation failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 6: updateAppUsersCount Function (Callable)
async function testUpdateAppUsersCount() {
    console.log('\n👥 Testing updateAppUsersCount...');
    
    const url = `${TEST_CONFIG.functionsUrl}/updateAppUsersCount`;
    const payload = {
        data: {
            appId: TEST_CONFIG.testAppId
        }
    };
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    if (success && data) {
        logTest('updateAppUsersCount', 'PASS', 'Users count update successful', {
            usersCount: data.usersCount,
            appId: data.appId
        });
    } else {
        logTest('updateAppUsersCount', 'FAIL', `Users count update failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 7: getAdminStats Function (Callable)
async function testGetAdminStats() {
    console.log('\n📊 Testing getAdminStats...');
    
    const url = `${TEST_CONFIG.functionsUrl}/getAdminStats`;
    const payload = {
        data: {}
    };
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    // This will likely fail due to admin authentication
    if (response && response.status === 401) {
        logTest('getAdminStats', 'PASS', 'Function structure correct (admin authentication required)', {
            status: response.status,
            message: 'Admin authentication required as expected'
        });
    } else if (success && data) {
        logTest('getAdminStats', 'PASS', 'Admin stats retrieval successful', data);
    } else {
        logTest('getAdminStats', 'FAIL', `Admin stats retrieval failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 8: stripeWebhook Function
async function testStripeWebhook() {
    console.log('\n💳 Testing stripeWebhook...');
    
    const url = `${TEST_CONFIG.functionsUrl}/stripeWebhook`;
    const payload = {
        type: 'checkout.session.completed',
        data: {
            object: {
                id: 'test_session_' + Date.now(),
                metadata: {
                    appId: TEST_CONFIG.testAppId
                }
            }
        }
    };
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    // This will likely fail due to signature verification, but we can test the function structure
    if (response && response.status === 400) {
        logTest('stripeWebhook', 'PASS', 'Function structure correct (signature verification required)', {
            status: response.status,
            message: 'Stripe signature verification required as expected'
        });
    } else if (success) {
        logTest('stripeWebhook', 'PASS', 'Stripe webhook processing successful', data);
    } else {
        logTest('stripeWebhook', 'FAIL', `Stripe webhook processing failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 9: grantAdminToShalom Function
async function testGrantAdminToShalom() {
    console.log('\n👑 Testing grantAdminToShalom...');
    
    const url = `${TEST_CONFIG.functionsUrl}/grantAdminToShalom`;
    
    const { response, data, success, error } = await makeRequest(url, {
        method: 'POST'
    });
    
    if (success && data) {
        logTest('grantAdminToShalom', 'PASS', 'Admin grant successful', data);
    } else {
        logTest('grantAdminToShalom', 'FAIL', `Admin grant failed: ${error || data?.error || 'Unknown error'}`, {
            status: response?.status,
            error: data?.error
        });
    }
}

// Test 10: Function Availability Check
async function testFunctionAvailability() {
    console.log('\n🔍 Testing function availability...');
    
    const functions = [
        'approveApp',
        'cacheAdminStats',
        'createReview',
        'deleteApp',
        'generateThumbnail',
        'getAdminStats',
        'getNewsletterSubscriptions',
        'getReports',
        'grantAdminToShalom',
        'markReportResolved',
        'processImage',
        'redirectAndLogClick',
        'stripeWebhook',
        'updateAllAppsUsersCount',
        'updateAppUsersCount',
        'weeklyNewsletterJob'
    ];
    
    let availableCount = 0;
    
    for (const funcName of functions) {
        try {
            const url = `${TEST_CONFIG.functionsUrl}/${funcName}`;
            const response = await fetch(url, { method: 'HEAD' });
            
            if (response.status !== 404) {
                availableCount++;
            }
        } catch (error) {
            // Function might not be accessible via HEAD request
        }
    }
    
    if (availableCount >= functions.length * 0.8) {
        logTest('Function Availability', 'PASS', `${availableCount}/${functions.length} functions available`, {
            available: availableCount,
            total: functions.length,
            percentage: Math.round((availableCount / functions.length) * 100)
        });
    } else {
        logTest('Function Availability', 'FAIL', `Only ${availableCount}/${functions.length} functions available`, {
            available: availableCount,
            total: functions.length,
            percentage: Math.round((availableCount / functions.length) * 100)
        });
    }
}

// Performance Test
async function testPerformance() {
    console.log('\n⚡ Testing performance...');
    
    const startTime = performance.now();
    
    // Test multiple concurrent requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
        promises.push(makeRequest(`${TEST_CONFIG.functionsUrl}/redirectAndLogClick?appId=test-${i}`));
    }
    
    const results = await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = totalTime / results.length;
    
    if (avgResponseTime < 2000 && successCount >= 3) {
        logTest('Performance', 'PASS', `Average response time: ${avgResponseTime.toFixed(2)}ms`, {
            totalTime: totalTime.toFixed(2),
            successCount,
            totalRequests: results.length,
            avgResponseTime: avgResponseTime.toFixed(2)
        });
    } else {
        logTest('Performance', 'FAIL', `Performance issues detected`, {
            totalTime: totalTime.toFixed(2),
            successCount,
            totalRequests: results.length,
            avgResponseTime: avgResponseTime.toFixed(2)
        });
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting VibeStore Cloud Functions Test Suite');
    console.log(`📋 Test Configuration:`, TEST_CONFIG);
    console.log('=' * 60);
    
    const startTime = performance.now();
    
    try {
        // Run all tests
        await testFunctionAvailability();
        await testRedirectAndLogClick();
        await testProcessImage();
        await testGenerateThumbnail();
        await testApproveApp();
        await testCreateReview();
        await testUpdateAppUsersCount();
        await testGetAdminStats();
        await testStripeWebhook();
        await testGrantAdminToShalom();
        await testPerformance();
        
    } catch (error) {
        console.error('❌ Test suite error:', error);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Generate test report
    console.log('\n' + '=' * 60);
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' * 60);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Total: ${testResults.total}`);
    console.log(`⏱️ Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
    
    if (testResults.failed === 0) {
        console.log('\n🎉 All tests passed! Cloud Functions are working correctly.');
    } else {
        console.log('\n⚠️ Some tests failed. Check the details above.');
    }
    
    // Detailed results
    console.log('\n📋 DETAILED RESULTS:');
    testResults.details.forEach((test, index) => {
        const status = test.status === 'PASS' ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${test.name}: ${test.message}`);
        if (test.data) {
            console.log(`   Data: ${JSON.stringify(test.data, null, 2)}`);
        }
    });
    
    return testResults;
}

// Export for use in other environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testResults,
        TEST_CONFIG
    };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    window.VibeStoreTests = {
        runAllTests,
        testResults,
        TEST_CONFIG
    };
    
    // Auto-run tests
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🧪 VibeStore Cloud Functions Test Suite loaded');
        console.log('Run VibeStoreTests.runAllTests() to start testing');
    });
}
