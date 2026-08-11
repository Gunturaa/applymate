"use client"
import React, { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { updateApplicationStatus } from "../applications/actions"
import { toast } from "@/components/ui/toast"
import { useLanguage } from "@/lib/i18n/context"

const statuses = ["Wishlist", "Applied", "Screening", "Assessment", "Interview", "Offer", "Rejected"]

export function KanbanClient({ initialData }: { initialData: any[] }) {
  const { dictionary } = useLanguage()
  const [columns, setColumns] = useState<Record<string, any[]>>({})
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const cols: Record<string, any[]> = {}
    statuses.forEach(status => {
      cols[status] = initialData.filter(app => app.status.toLowerCase() === status.toLowerCase())
    })
    setColumns(cols)
    setIsMounted(true)
  }, [initialData])

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn]
    const destItems = [...destColumn]
    
    const [removed] = sourceItems.splice(source.index, 1)
    
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: sourceItems
      })
    } else {
      removed.status = destination.droppableId.toLowerCase()
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      })
      
      // Update the backend
      const res = await updateApplicationStatus(draggableId, destination.droppableId)
      if (res.error) {
        // toast.add({ title: "Error", description: "Failed to update status", type: "error" })
        console.error(res.error)
      }
    }
  }

  if (!isMounted) return null

  return (
    <div className="flex-1 overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full items-start min-w-max">
          {statuses.map(status => (
            <div key={status} className="w-80 flex flex-col max-h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{dictionary.applications.status[status.toLowerCase() as keyof typeof dictionary.applications.status] || status}</h3>
                <Badge variant="secondary" className="rounded-full">{columns[status]?.length || 0}</Badge>
              </div>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 overflow-y-auto space-y-3 min-h-[150px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                  >
                    {columns[status]?.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`shadow-sm cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-70 ring-2 ring-primary' : ''}`}
                          >
                            <CardContent className="p-4">
                              <div className="font-medium text-sm mb-1">{item.position}</div>
                              <div className="text-sm text-muted-foreground mb-3">{item.companies?.name || 'Unknown'}</div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {item.applied_at ? new Date(item.applied_at).toLocaleDateString('en-GB') : '-'}
                                </span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] px-1 py-0 h-4 ${
                                    item.priority === 'high' ? 'border-red-200 text-red-600 bg-red-50 dark:bg-red-900/10' : 
                                    item.priority === 'medium' ? 'border-yellow-200 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10' : 
                                    'border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/10'
                                  }`}
                                >
                                  {item.priority}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
