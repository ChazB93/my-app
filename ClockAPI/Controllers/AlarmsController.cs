using ClockAPI.Data;
using ClockAPI.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ReactDemo.Controllers;

[ApiController]
[Route("[controller]")]
public class AlarmsController : ControllerBase
{
    private readonly ClockAppContext _reactJSDemoContext;
    public AlarmsController(ClockAppContext reactJSDemoContext)
    {
        _reactJSDemoContext = reactJSDemoContext;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var alarm = await _reactJSDemoContext.Alarms.ToListAsync();
        return Ok(alarm);
    }

    [HttpPost]
    public async Task<IActionResult> Post(Alarms newAlarms)
    {
        _reactJSDemoContext.Alarms.Add(newAlarms);
        await _reactJSDemoContext.SaveChangesAsync();
        return Ok(newAlarms);
    }


    [HttpGet]
    [Route("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var alarmById = await _reactJSDemoContext
        .Alarms.Where(_ => _.Id == id)
        .FirstOrDefaultAsync();
        return Ok(alarmById);
    }

    [HttpPut]
    public async Task<IActionResult> Put(Alarms alarmToUpdate)
    {
        _reactJSDemoContext.Alarms.Update(alarmToUpdate);
        await _reactJSDemoContext.SaveChangesAsync();
        return Ok(alarmToUpdate);
    }

    [HttpDelete]
    [Route("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var alarmToDelete = await _reactJSDemoContext.Alarms.FindAsync(id);
        if (alarmToDelete == null)
        {
            return NotFound();
        }
        _reactJSDemoContext.Alarms.Remove(alarmToDelete);
        await _reactJSDemoContext.SaveChangesAsync();
        return Ok();
    }
}