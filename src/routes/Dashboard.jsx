import React from 'react'
import Headings from '../components/Headings'
import { Button } from '../components/ui/Button'
import { Plus, SeparatorHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header section with title and action button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <Headings
            title="Dashboard"
            description="Create and manage your content"
          />
        </div>
        
        <Link to="/generate/create">
          <Button size="sm" className="cursor-pointer bg-black text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add new
          </Button>
        </Link>
      </div>
      
      {/* <div className="mb-6 w-full h-4 text-gray-900">
      </div> */}
      
      {/* Main content area */}
      <div className="bg-white/40 rounded-lg shadow p-6">
        {/* Dashboard content can go here */}
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        
        {/* Empty state or actual content */}
        <div className="text-center py-8 text-gray-500">
          <p>No recent activities to display.</p>
          <p className="mt-2 underline">Get started by creating your first item</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard