import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  FireIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Training Schedule',
    description: 'View upcoming gym classes and workout sessions. Never miss a training opportunity.',
    icon: CalendarIcon,
  },
  {
    name: 'Workout Programs',
    description: 'Access professionally designed workout programs created by your gym trainers.',
    icon: FireIcon,
  },
  {
    name: 'Track Your Progress',
    description: 'Log your workouts, track your sets, reps, and weights. See your improvement over time.',
    icon: ChartBarIcon,
  },
  {
    name: 'Community Connection',
    description: 'Connect with fellow gym members, share tips, and support each other\'s fitness goals.',
    icon: UserGroupIcon,
  },
];

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative pb-16 pt-16 sm:pb-24 lg:pb-32">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Welcome to Alternative Athletics
              </h1>
              <p className="mt-6 text-lg leading-8 text-primary-100">
                Your member portal for training schedules, workout tracking, and community connection.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/register"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Get started
                </Link>
                <Link
                  to="/login"
                  className="flex items-center text-sm font-semibold leading-6 text-white hover:text-primary-100 transition-colors"
                >
                  Sign in <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Member Benefits</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your gym membership portal gives you 24/7 access to schedules, programs, and community support.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-8 w-8 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to start training?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Sign in to access your member portal and take your fitness to the next level.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
              >
                Member sign up
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
              >
                Member login <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; 2024 Alternative Athletics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
