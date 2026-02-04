using System.ComponentModel.DataAnnotations;

namespace TodoListModels
{
    public class TodoListItem
    {
        public int Id { get; set; }

        [Required, StringLength(100)]   
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsComplete { get; set; }
    }
}
