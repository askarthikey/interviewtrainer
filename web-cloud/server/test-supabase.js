require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME || 'interview-recordings';

console.log('🔍 Testing Supabase Configuration...\n');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_BUCKET_NAME:', bucketName, '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSupabase() {
  try {
    // Test 1: List buckets
    console.log('📦 Test 1: Listing storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('✅ Available buckets:', buckets.map(b => b.name).join(', '));
    
    const bucketExists = buckets.find(b => b.name === bucketName);
    if (!bucketExists) {
      console.log(`\n⚠️  Bucket "${bucketName}" does NOT exist!`);
      console.log('Creating bucket...');
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError);
        return;
      }
      
      console.log('✅ Bucket created successfully!');
    } else {
      console.log(`✅ Bucket "${bucketName}" exists!`);
    }
    
    // Test 2: Upload a test file
    console.log('\n📤 Test 2: Uploading test file...');
    const testContent = Buffer.from('Test file content');
    const testFileName = `test/${Date.now()}-test.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      
      // Check bucket policies
      console.log('\n🔐 Checking bucket policies...');
      const { data: policies, error: policyError } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1 });
      
      if (policyError) {
        console.error('❌ Policy check error:', policyError);
        console.log('\n💡 SOLUTION: You need to set up RLS policies for the bucket:');
        console.log('   1. Go to Supabase Dashboard → Storage → Policies');
        console.log('   2. Create a policy for INSERT operations');
        console.log('   3. Allow service_role or authenticated users');
      }
      return;
    }
    
    console.log('✅ Upload successful!');
    console.log('   Path:', uploadData.path);
    
    // Test 3: Get public URL
    console.log('\n🌐 Test 3: Getting public URL...');
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(testFileName);
    
    console.log('✅ Public URL:', urlData.publicUrl);
    
    // Test 4: Delete test file
    console.log('\n🗑️  Test 4: Cleaning up test file...');
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testFileName]);
    
    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
    } else {
      console.log('✅ Test file deleted!');
    }
    
    console.log('\n✅✅✅ All tests passed! Supabase is configured correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSupabase();
