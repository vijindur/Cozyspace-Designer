import { Design } from '@/types/design';
import { useDesign } from '@/contexts/DesignContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, Package } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DesignCardProps {
  design: Design;
}

const DesignCard = ({ design }: DesignCardProps) => {
  const { loadDesign, deleteDesign } = useDesign();
  const navigate = useNavigate();

  const handleOpen = () => {
    loadDesign(design.id);
    navigate('/editor');
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="group border rounded-xl bg-card overflow-hidden card-hover cursor-pointer animate-fade-in">
      {/* Preview area — shows a mini representation */}
      <div
        className="h-32 relative flex items-center justify-center"
        style={{ backgroundColor: design.room.floorColor + '40' }}
        onClick={handleOpen}
      >
        <div
          className="border-2 border-foreground/10 relative"
          style={{
            width: `${Math.min(design.room.width * 18, 140)}px`,
            height: `${Math.min(design.room.length * 18, 100)}px`,
            backgroundColor: design.room.floorColor,
          }}
        >
          {design.furniture.map(f => {
            const scalePreview = Math.min(18, 140 / design.room.width);
            return (
              <div
                key={f.id}
                className="absolute border border-foreground/20"
                style={{
                  left: f.x * scalePreview,
                  top: f.y * scalePreview,
                  width: Math.max(4, f.width * scalePreview),
                  height: Math.max(4, f.depth * scalePreview),
                  backgroundColor: f.color,
                  transform: `rotate(${f.rotation}deg)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="p-4" onClick={handleOpen}>
        <h3 className="font-display font-semibold text-base truncate">{design.name}</h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            {design.furniture.length} items
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(design.updatedAt)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {design.room.width}m × {design.room.length}m
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-destructive hover:text-destructive"
              onClick={e => e.stopPropagation()}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Design?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{design.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteDesign(design.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DesignCard;
