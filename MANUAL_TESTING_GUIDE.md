# Manual Testing Guide for Super VM System

This guide provides step-by-step instructions for manually testing the Super VM distributed computing system.

## 🚀 Quick Start Testing

### Option 1: Automated Testing (Recommended)

```bash
./test-super-vm-system.sh
```

This will run all tests automatically and provide a comprehensive report.

### Option 2: Manual Testing

Follow the steps below to test each component individually.

## 📋 Prerequisites Check

Before testing, ensure you have:

1. **Node.js 16+ installed**

   ```bash
   node --version
   # Should show v16.0.0 or higher
   ```

2. **Docker installed and running**

   ```bash
   docker --version
   docker info
   # Should show Docker is running
   ```

3. **Project structure**
   ```bash
   ls -la
   # Should show cluster-manager/ and main-ui/ directories
   ```

## 🔧 Step-by-Step Manual Testing

### Step 1: Install Dependencies

```bash
# Install cluster manager dependencies
cd cluster-manager
npm install
cd ..

# Install dashboard dependencies
cd main-ui
npm install
cd ..
```

### Step 2: Start the System

#### Terminal 1: Start Cluster Manager

```bash
cd cluster-manager
node index.js
```

Expected output:

```
Cluster Manager API with Super VM running on port 3000
Super VM initialized successfully
```

#### Terminal 2: Start Dashboard

```bash
cd main-ui
npm run dev
```

Expected output:

```
VITE v4.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### Step 3: Test API Endpoints

Open a new terminal and test the API endpoints:

#### Health Check

```bash
curl http://localhost:3000/api/health
```

Expected: JSON response with status "healthy"

#### Super VM Status

```bash
curl http://localhost:3000/api/super-vm/status
```

Expected: JSON response with Super VM status

#### Resources

```bash
curl http://localhost:3000/api/super-vm/resources
```

Expected: JSON response with resource pool information

#### Metrics

```bash
curl http://localhost:3000/api/super-vm/metrics
```

Expected: JSON response with performance metrics

### Step 4: Test Task Execution

#### Data Processing Task

```bash
curl -X POST http://localhost:3000/api/super-vm/process \
  -H 'Content-Type: application/json' \
  -d '{
    "inputData": [5, 2, 8, 1, 9, 3, 7, 4, 6],
    "operation": "sort",
    "parameters": {
      "cpu": 1,
      "memory": 512
    }
  }'
```

Expected: JSON response with sorted data and execution details

#### System Scaling

```bash
curl -X POST http://localhost:3000/api/super-vm/scale \
  -H 'Content-Type: application/json' \
  -d '{"nodes": 1}'
```

Expected: JSON response confirming scaling operation

### Step 5: Test Dashboard

1. **Open Dashboard**

   - Open your browser and go to: http://localhost:5173
   - You should see the Super VM dashboard

2. **Test Dashboard Features**

   - Check if the dashboard loads without errors
   - Verify the sidebar navigation works
   - Test the theme toggle (dark/light mode)
   - Check if real-time data is updating

3. **Test Dashboard Pages**
   - **Dashboard**: Check system overview and metrics
   - **VM Manager**: View VM list and status
   - **Task Manager**: Check task history and execution
   - **Resource Monitor**: View resource utilization charts
   - **Settings**: Verify settings page loads

### Step 6: Test Dashboard Functionality

#### Quick Actions

1. Go to the Dashboard page
2. Try the "Data Processing" quick action
3. Check if the task appears in Task Manager
4. Verify the task completes successfully

#### VM Management

1. Go to VM Manager page
2. Check if VM list displays correctly
3. Try selecting VMs (if any are available)
4. Test bulk operations (if VMs are selected)

#### Task Management

1. Go to Task Manager page
2. Check if task history displays
3. Try filtering tasks by status
4. Test task search functionality

#### Resource Monitoring

1. Go to Resource Monitor page
2. Check if charts are displaying
3. Verify real-time updates
4. Test different time ranges

### Step 7: Performance Testing

#### API Response Time

```bash
time curl -s http://localhost:3000/api/health > /dev/null
```

Expected: Response time under 1 second

#### Concurrent Requests

```bash
for i in {1..5}; do
  curl -s http://localhost:3000/api/health > /dev/null &
done
wait
```

Expected: All requests complete successfully

#### Dashboard Performance

1. Open browser developer tools (F12)
2. Go to Network tab
3. Refresh the dashboard
4. Check load times for API calls
5. Verify no failed requests

### Step 8: Error Handling Testing

#### Test Invalid API Requests

```bash
# Test invalid endpoint
curl http://localhost:3000/api/invalid

# Test invalid task data
curl -X POST http://localhost:3000/api/super-vm/process \
  -H 'Content-Type: application/json' \
  -d '{"invalid": "data"}'
```

Expected: Proper error responses with status codes

#### Test Dashboard Error Handling

1. Stop the cluster manager
2. Refresh the dashboard
3. Check if error messages display properly
4. Restart the cluster manager
5. Verify dashboard recovers automatically

## 🧪 Advanced Testing

### Load Testing

```bash
# Test multiple concurrent tasks
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/super-vm/process \
    -H 'Content-Type: application/json' \
    -d "{\"inputData\":[1,2,3,4,5],\"operation\":\"sort\",\"parameters\":{\"cpu\":1,\"memory\":256}}" &
done
wait
```

### Memory Testing

```bash
# Test with large data
curl -X POST http://localhost:3000/api/super-vm/process \
  -H 'Content-Type: application/json' \
  -d "{\"inputData\":$(seq 1 10000 | tr '\n' ',' | sed 's/,$//'),\"operation\":\"sort\",\"parameters\":{\"cpu\":2,\"memory\":2048}}"
```

### Long-Running Task Testing

```bash
# Test task that takes longer to complete
curl -X POST http://localhost:3000/api/super-vm/process \
  -H 'Content-Type: application/json' \
  -d '{
    "inputData": [1,2,3,4,5,6,7,8,9,10],
    "operation": "sort",
    "parameters": {
      "cpu": 1,
      "memory": 512,
      "delay": 5000
    }
  }'
```

## 📊 Expected Results

### API Endpoints

- All endpoints should return HTTP 200 status
- JSON responses should be properly formatted
- Error endpoints should return appropriate error codes

### Dashboard

- Should load without JavaScript errors
- Real-time updates should work
- All pages should be accessible
- Theme switching should work
- Responsive design should work on different screen sizes

### Task Execution

- Tasks should complete successfully
- Results should be properly formatted
- Error handling should work for invalid tasks
- Performance should be acceptable

### System Stability

- No memory leaks
- No crashes during normal operation
- Proper cleanup on shutdown
- Automatic recovery from errors

## 🐛 Troubleshooting

### Common Issues

#### Dashboard Won't Load

- Check if cluster manager is running on port 3000
- Check browser console for errors
- Verify API endpoints are accessible

#### API Not Responding

- Check if cluster manager process is running
- Check terminal output for error messages
- Verify port 3000 is not blocked

#### Tasks Not Executing

- Check if VMs are available and running
- Verify network connectivity
- Check task logs for specific errors

#### Performance Issues

- Monitor system resources (CPU, memory)
- Check for memory leaks
- Verify no infinite loops in code

### Debug Commands

#### Check Process Status

```bash
ps aux | grep node
ps aux | grep npm
```

#### Check Port Usage

```bash
lsof -i :3000
lsof -i :5173
```

#### Check Logs

```bash
# Cluster manager logs (in terminal where it's running)
# Dashboard logs (in terminal where it's running)
# Browser console logs (F12 in browser)
```

#### Network Testing

```bash
# Test localhost connectivity
ping localhost

# Test specific ports
telnet localhost 3000
telnet localhost 5173
```

## ✅ Success Criteria

The system is working correctly if:

1. ✅ All API endpoints respond with correct status codes
2. ✅ Dashboard loads and displays correctly
3. ✅ Real-time updates work in the dashboard
4. ✅ Task execution completes successfully
5. ✅ Error handling works properly
6. ✅ Performance is acceptable (< 1s response time)
7. ✅ System remains stable during testing
8. ✅ All dashboard features are functional

## 📝 Test Report Template

After completing the tests, document your results:

```
Test Date: [Date]
Tester: [Name]
System: [OS/Version]

Prerequisites:
- Node.js: [Version] ✅/❌
- Docker: [Version] ✅/❌
- Project Structure: ✅/❌

API Testing:
- Health Check: ✅/❌
- Super VM Status: ✅/❌
- Resources: ✅/❌
- Metrics: ✅/❌
- Task Execution: ✅/❌
- Scaling: ✅/❌

Dashboard Testing:
- Loading: ✅/❌
- Navigation: ✅/❌
- Real-time Updates: ✅/❌
- Theme Switching: ✅/❌
- All Pages: ✅/❌

Performance:
- API Response Time: [ms]
- Dashboard Load Time: [ms]
- Concurrent Requests: ✅/❌

Issues Found:
- [List any issues encountered]

Overall Status: ✅ PASS / ❌ FAIL
```

## 🎯 Next Steps

If all tests pass:

1. **Explore the Dashboard**: Try all features and pages
2. **Submit Real Tasks**: Test with your own data
3. **Monitor Performance**: Watch resource usage
4. **Scale the System**: Add more VMs if needed
5. **Customize**: Modify settings and configuration

If tests fail:

1. **Check Logs**: Review error messages
2. **Verify Prerequisites**: Ensure all requirements are met
3. **Debug Issues**: Use troubleshooting steps above
4. **Fix Problems**: Address any identified issues
5. **Re-run Tests**: Test again after fixes
