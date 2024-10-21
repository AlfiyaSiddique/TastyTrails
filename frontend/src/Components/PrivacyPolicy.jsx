
import React from 'react';

const  PrivacyPolicy= () => {
  return (
    <div className="max-w-4xl mx-auto p-6 overflow-auto h-full">
      <p className='text-xl mb-2 font-bold text-gray-500'>Legal Terms</p>
      <h1 className="text-3xl font-bold mb-4">
        Privacy Policy for 
        <span className="block sm:inline lg:mx-2 md:mx-2 text-red-700">TastyTrails 😋</span>
      </h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to <strong className='text-red-700'>TastyTrails</strong>! We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website <a href="http://www.tastytrails.com" className="text-blue-500 underline">www.tastytrails.com</a>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold">a. Registration Data:</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Name:</strong> Collected during account creation.</li>
          <li><strong>Email Address:</strong> Used for account management and communication.</li>
        </ul>

        <h3 className="text-xl font-semibold">b. Feedback Messages:</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Feedback Content:</strong> Information you provide through our feedback form to help us improve our services.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>For Registration:</strong> To create and manage your user account, allowing you to access personalized features.</li>
          <li><strong>For Feedback Improvement:</strong> To analyze and enhance the user experience based on your feedback.</li>
          <li><strong>For Communication:</strong> To send you updates or necessary information related to your account or feedback.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
        <p>
          We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Your data is stored securely using industry-standard practices, and session management is employed to ensure safe authentication processes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. User Rights</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Access and Update:</strong> You can view and update your account information at any time through your profile settings.</li>
          <li><strong>Account Deletion:</strong> Currently, we do not offer the option to delete user accounts. If you wish to have your data removed, please contact us directly at <a href="mailto:privacy@tastytrails.com" className="text-blue-500 underline">privacy@tastytrails.com</a>.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
        </p>
        <ul className="list-disc list-inside">
          <li><strong>Email:</strong> <a href="mailto:privacy@tastytrails.com" className="text-blue-500 underline">privacy@tastytrails.com</a></li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
