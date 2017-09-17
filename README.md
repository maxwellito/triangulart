# Triangulart

Dummy graphic editor to make isometric illustrations. It's like pixel art, but for triangles.

Try it on [maxwellito.github.io/triangulart](https://maxwellito.github.io/triangulart)

The editor is really basic but does the job pretty well. Unfortunately, many features are missing: touch screen support, undo, fill, move a group, zoom... 

## v2 is on the way :)

[X] Undo
[X] Selection
[X] Move selection
[X] Fill selection
[X] Erase selection
[X] Fullscreen
[X] Local storage
[ ] Auto save (but better)
[ ] Sevice worker for offline
[ ] PWA materials
[-] Touch compatible
[X] Universal format (SVG only, no more JSON)
[ ] Responsive layout
[X] Routing
[ ] Taking care of error cases


## File format

On the v2, we are making things simpler, one unique file format : the SVG. On the first version the editable format was in JSON, and I think it was a bad design choice. Having one format make it easier for the final user.

Here are the details

```xml
<svg version="1.1" preserveAspectRatio="xMinYMin slice" width="930" height="520" viewBox="0 0 930 520">
    <!--{"isLandscape":true,"mapWidth":"31","mapHeight":20,"palette":["#11aaff","#ff0002","#c5ceda","#000000"]}-->
    <path d="M345 0 L330 26 L360 26 Z" fill="#000000" rel="22"></path>
    <path d="M345 0 L360 26 L375 0 Z" fill="#000000" rel="23"></path>
    <path d="M375 0 L360 26 L390 26 Z" fill="#000000" rel="24"></path>
    <path d="M375 0 L390 26 L405 0 Z" fill="#000000" rel="25"></path>
    ...
</svg>
```

The SVG first child node is a comment containing the JSON of the basic details of the artwork. It contains the orientation, width, height, and the palette.
Then every path got the `rel` attribute to contain the triangle index.



## for v2.1

- MASSIVE PERF ISSUES ON BIG WORKSPACE : MOVE TO CANVAS (and light the weight of triangulart class)
- Zoom in/out
- Clipboard!