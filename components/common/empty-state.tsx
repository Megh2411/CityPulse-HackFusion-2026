'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon = '📋', title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="bg-primary hover:bg-orange-600 text-white">
          {action.label}
        </Button>
      )}
    </Card>
  )
}
