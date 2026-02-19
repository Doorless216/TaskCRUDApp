using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoListDataLayer;
using TodoListModels;
//test
namespace TodoList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoListItemsController : ControllerBase
    {
        private readonly TodoListDbContext _context;

        public TodoListItemsController(TodoListDbContext context)
        {
            _context = context;
        }

        // GET: api/TodoListItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoListItem>>> GetTodoListItems()
        {
            return await _context.TodoListItems.ToListAsync();
        }

        // GET: api/TodoListItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoListItem>> GetTodoListItem(int id)
        {
            var todoListItem = await _context.TodoListItems.FindAsync(id);

            if (todoListItem == null)
            {
                return NotFound();
            }

            return todoListItem;
        }

        // PUT: api/TodoListItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoListItem(int id, TodoListItem todoListItem)
        {
            if (id != todoListItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(todoListItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoListItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TodoListItems
        [HttpPost]
        public async Task<ActionResult<TodoListItem>> PostTodoListItem(TodoListItem todoListItem)
        {
            _context.TodoListItems.Add(todoListItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTodoListItem", new { id = todoListItem.Id }, todoListItem);
        }

        // DELETE: api/TodoListItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoListItem(int id)
        {
            var todoListItem = await _context.TodoListItems.FindAsync(id);
            if (todoListItem == null)
            {
                return NotFound();
            }

            _context.TodoListItems.Remove(todoListItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TodoListItemExists(int id)
        {
            return _context.TodoListItems.Any(e => e.Id == id);
        }
    }
}
