//file for testing posts

process.env.NODE_ENV = 'test'; // Set environment variable for Jest tests
const request = require('supertest');
const app = require('../server'); // Ensure correct server import
// Start and stop the server for testing
let server;
let token; 
let postId; 

beforeAll(() => {
    server = app.listen(5000); // Start the server
  });

beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login') // Simulate user login
      .send({ email: 'yancea@uwplatt.edu', password: '3001729@Yb' }); // Correct method chaining
    
    //console.log('Login response:', loginResponse.status, loginResponse.body); // Log the login response
    token = loginResponse.body.token; // Store the token
  });
  
  afterAll(() => {
    if (server) {
      server.close(); // Ensure the server is closed after tests
    }
  });

  describe('getPostsByUser', () => {
    test('should retrieve posts for a user successfully', async () => {
      
  
      const response = await request(app)
        .get('/api/posts/user/posts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200); 
  
      expect(response.body[0]).toHaveProperty('title'); // Ensure that posts have titles.

   
    });
  });



  test('should handle database errors when retrieving posts by a user', done => {
    jest.isolateModules(() => {
        const Post = require('../models/PostModel');
        const request = require('supertest');
        const app = require('../server');

        // Mocking the Post model methods to throw an error
        Post.find = jest.fn(() => ({
            populate: jest.fn().mockRejectedValue(new Error('Database failure'))
        }));

        request(app)
            .get('/api/posts/user/posts')
            .set('Authorization', `Bearer ${token}`)
            .end((err, response) => { 
                expect(response.status).toBe(500);
                done();
            });
    });
},10000); 



  test('should handle database errors when retrieving all posts', async () => {
    jest.isolateModules(() => {
        jest.doMock('../models/PostModel', () => {
            return {
                find: jest.fn(() => Promise.reject(new Error('Database failure')))
            };
        });

        // Require the Post model inside the isolateModules callback after setting up the mock
        const Post = require('../models/PostModel');
        const app = require('../server'); // Make sure app is loaded here if it depends on PostModel

        request(app)
            .get('/api/posts')
            .expect(500)
            .end((err, response) => {
  
                jest.resetModules(); // Clean up after the test
            });
    });
});

test('should return 500 if the post to delete is not found', async () => {
  const fakePostId = 'nonexistentid';
  const response = await request(app)
    .delete(`/api/posts/${fakePostId}`)
    .expect(500);

});



test('should return 404 if the post to delete is not found', async () => {
  jest.isolateModules(() => {
      // Mock the PostModel to simulate not finding the post
      jest.doMock('../models/PostModel', () => {
          return {
              findByIdAndDelete: jest.fn().mockResolvedValue(null)
          };
      });

      // Require the Post model and the app inside the isolateModules callback
      const Post = require('../models/PostModel');
      const app = require('../server'); 

      // Make the API request
      request(app)
          .delete('/api/posts/nonexistentid')
          .expect(404)
          .end((err, response) => {
              if (err) throw err;

              jest.resetModules(); // Clean up after the test
          });
  });
});



test('should return 404 if the post to is not found', async () => {
  jest.isolateModules(() => {
      // Mock the PostModel to simulate not finding the post
      jest.doMock('../models/PostModel', () => {
          return {
              findByIdAndDelete: jest.fn().mockResolvedValue(null)
          };
      });

      // Require the Post model and the app inside the isolateModules callback
      const Post = require('../models/PostModel');
      const app = require('../server'); // Adjust this if your server setup is named differently

      // Make the API request
      request(app)
          .delete('/api/posts/interests/nonexistentid')
          .expect(404)
          .end((err, response) => {
              if (err) throw err;
              //expect(response.body).toHaveProperty('message', 'Post not found');
              jest.resetModules(); // Clean up after the test
          });
  });
});


test('should handle database errors when retrieving all posts', done => {
  jest.isolateModules(() => {
      jest.doMock('../models/PostModel', () => ({
          find: jest.fn().mockRejectedValue(new Error('Database failure'))
      }));

      // Require the Post model inside the isolateModules callback after setting up the mock
      const Post = require('../models/PostModel');
      const app = require('../server'); // Make sure app is loaded here if it depends on PostModel

      const request = require('supertest');
      request(app)
          .get('/api/posts')
          .expect(500)
          .end((err, response) => {
              expect(response.body).toHaveProperty('message', 'Database failure');
              jest.resetModules(); // Clean up after the test
              done(); // Notify Jest that the test is complete when the asynchronous operation ends
          });
  });
});


test('should return 401 if the password is incorrect', async () => {

  const response = await request(app)
    .post('/api/auth/login')  // Adjust the endpoint as necessary
    .send({
      email: 'yancea@uwplatt.edu',
      password: 'wrongpassword'
    })
    .expect(401);


});

test('should return 500 if missing field', async () => {

  const response = await request(app)
    .post('/api/auth/login')  // Adjust the endpoint as necessary
    .send({
      email: 'yancea@uwplatt.edu',
      //password: 'wrongpassword'
    })
    .expect(500);


});

test('should return 404 if user is not found', async () => {
  // Ensure no users are present in the database
  const response = await request(app)
    .post('/api/auth//login')
    .send({
      email: 'nonexistent@example.com',
      password: 'anyPassword'  // Any password since no user exists
    })
    .expect(404);

});


  test('should sign up a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456789@Ay',
      phone: '1234567890'
    };
  
    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(201);
  
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('name', userData.name);
    expect(response.body.data).toHaveProperty('email', userData.email);
    expect(response.body.data).toHaveProperty('phone', userData.phone);
  });

 
  
  test('should handle errors during signup', async () => {

    const response = await request(app)
      .post('/api/auth/signup')  // Adjust the endpoint as necessary
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        //password: 'password123',
        phone: '1234567890'
      })
      .expect(500);

    expect(response.body).toEqual({
      success: false,
      error: 'Error signing up'
    });
  });

  
  //test to get name from user 
  test('should retrieve the user\'s name', async () => {
    const response = await request(app)
      .get('/api/auth/user/name')
      .set('Authorization', `Bearer ${token}`)  // Use a valid token obtained from a login or setup step
      .expect(200);  // Expecting a successful response
  
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('name');
    // check if the name matches what you expect
    console.log('User name retrieved:', response.body.name);
  });

  //test to get name from email
  test('should retrieve the user\'s email', async () => {
    const response = await request(app)
      .get('/api/auth/user/email')
      .set('Authorization', `Bearer ${token}`)  // Use a valid token obtained from a login or setup step
      .expect(200);  // Expecting a successful response
  
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('email');
    // check if the name matches what you expect
    console.log('User name retrieved:', response.body.Email);
  });  
  

    //test to get name from phone
    test('should retrieve the user\'s phone', async () => {
      const response = await request(app)
        .get('/api/auth/user/phone')
        .set('Authorization', `Bearer ${token}`)  // Use a valid token obtained from a login or setup step
        .expect(200);  // Expecting a successful response
    
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('phone');
      // check if the name matches what you expect
      console.log('User phone retrieved:', response.body.Phone);
    });  


    // Test to update user name 
    test('should update the user\'s name', async () => {
      const newName = 'Andres D';
      const response = await request(app)
        .put('/api/auth/user/name') 
        .set('Authorization', `Bearer ${token}`) // Use a valid token obtained from a login or setup step
        .send({ newName: newName })
        .expect(200);  // Expecting a successful response
    
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('name', newName);
      console.log('Updated user name:', response.body.name);
    });
    
      // Test to update user name 
    test('should update the user\'s Email', async () => {
      const newEmail = 'yancea@uwplatt.edu';
      const response = await request(app)
        .put('/api/auth/user/email') 
        .set('Authorization', `Bearer ${token}`) // Use a valid token obtained from a login or setup step
        .send({ newEmail: newEmail })
        .expect(200);  // Expecting a successful response
    
      expect(response.body.success).toBe(true);  // Check the success flag
      expect(response.body).toHaveProperty('email', newEmail); // Correctly use toHaveProperty to check the 'email' property
      console.log('Updated user email:', response.body.email);
    });
    

    //test to update user phone
    test('should update the user\'s Phone', async () => {
      const newPhone = '9203442111';
      const response = await request(app)
        .put('/api/auth/user/phone') 
        .set('Authorization', `Bearer ${token}`) // Use a valid token obtained from a login or setup step
        .send({ newPhone: newPhone })
        .expect(200);  // Expecting a successful response
    
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('phone', newPhone);
      console.log('Updated user Phone:', response.body.phone);
    });

   // test with inavlid token 
    test('should create a new post with invalid token', async () => {
      const response = await request(app)
        .post('/api/posts') 
        .set('Authorization', `Bearer invalid`) // Use the obtained token for authorization
        .field('title', 'New Post')
        .field('content', 'Sample content.')
        .field('price', 100)
        .field('category', 'Electronics')
        .field('state', 'New')
        .expect(401);


  });
   
  //test post with no token 
  test('should create a new post with no token', async () => {
    const response = await request(app)
      .post('/api/posts') 
      .field('title', 'New Post')
      .field('content', 'Sample content.')
      .field('price', 100)
      .field('category', 'Electronics')
      .field('state', 'New')
      .expect(403);


});

// test post with empty strings 
test('should fail to create a post due to validation errors', async () => {
  const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
          title: '', 
          content: 'Sample content.',
          price: 100,
          category: 'Electronics',
          state: 'New',
          payment: 'Cash'
      })
      .expect(400);

});
    
    
  
// Test case to create a new post
test('should create a new post with token', async () => {
    const response = await request(app)
      .post('/api/posts') 
      .set('Authorization', `Bearer ${token}`) // Use the obtained token for authorization
      .field('title', 'New Post')
      .field('content', 'Sample content.')
      .field('author', '6604a1d59d9b5741acfa171e')
      .field('price', 100)
      .field('category', 'Electronics')
      .field('state', 'New')
      .attach('media', 'test/mask.jpg')
      
    postId = response.body.post._id;
    console.log(postId) // Store the post ID for further tests
    expect(response.statusCode).toBe(201); 
    expect(postId).toBeTruthy(); // Ensure the post ID is obtained

  });




  // Test to get all posts
test('should get all posts', async () => {
    const response = await request(app)
      .get('/api/posts') // Endpoint to get all posts
      .set('Authorization', `Bearer ${token}`); // Ensure authorization
  
    expect(response.statusCode).toBe(200); // Expected status for successful retrieval
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
    expect(response.body.length).toBeGreaterThan(0); // Ensure there's at least one post
  });




  test('should express interest in a post', async () => {
    const response = await request(app)
      .post(`/api/posts/interest/${postId}`) 
      .set('Authorization', `Bearer ${token}`); // Use the obtained token for authorization

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Interest expressed successfully');
});

// Test to retrieve posts a user is interested in
test('should retrieve posts the user is interested in', async () => {
  const response = await request(app)
    .get('/api/posts/user/interests')// Endpoint to get posts user is interested in
    .set('Authorization', `Bearer ${token}`); 

  expect(response.statusCode).toBe(200); // Expected status for successful retrieval
  expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
  expect(response.body.length).toBeGreaterThan(0); // Ensure there's at least one post

});


// Test to delete a post by ID
test('should delete a post by ID', async () => {
    const response = await request(app)
      .delete(`/api/posts/${postId}`) // Delete the post by stored ID
      .set('Authorization', `Bearer ${token}`); // Ensure authorization
  
    expect(response.statusCode).toBe(200); // Expected status for successful deletion
    expect(response.body).toHaveProperty('message', 'Post deleted'); // Check for success message
  });
  
  // Test to ensure the post is deleted
  test('should not find the deleted post', async () => {
    const response = await request(app)
      .get(`/api/posts/${postId}`) // Try to retrieve the deleted post
      .set('Authorization', `Bearer ${token}`); 
  
    expect(response.statusCode).toBe(404); // Expected status for not found
  });