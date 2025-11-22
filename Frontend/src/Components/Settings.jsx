import { Settings as SettingsIcon, User, Bell, Lock, Globe } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="p-6">{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-lg font-semibold text-[#2C2C36]">{children}</h3>;
const CardDescription = ({ children }) => <p className="text-sm text-gray-500 mt-1">{children}</p>;
const CardContent = ({ children }) => <div className="p-6 pt-0">{children}</div>;

export default function Settings() {
  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      items: ['Update profile photo', 'Change display name', 'Email preferences']
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure how you receive alerts and updates',
      items: ['Low stock alerts', 'Receipt notifications', 'Delivery updates']
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Manage your password and security settings',
      items: ['Change password', 'Two-factor authentication', 'Active sessions']
    },
    {
      icon: Globe,
      title: 'System Preferences',
      description: 'Customize system behavior and appearance',
      items: ['Language settings', 'Date format', 'Default warehouse']
    }
  ];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#2C2C36]">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and system preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#714B67]/10">
                    <Icon className="h-6 w-6 text-[#714B67]" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 hover:text-[#714B67] cursor-pointer transition-colors">
                      <span className="w-1.5 h-1.5 bg-[#714B67] rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
