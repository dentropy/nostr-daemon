
-- Example of json_each
SELECT 
    events.event_id,
    CAST(json_each.value as TEXT) AS matched_tag
FROM 
    events,
    json_each(events.tags)