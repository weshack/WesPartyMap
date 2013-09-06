require 'rubygems'
require 'json'

begin
	kmlData = IO.read "polygons.kml.xml"
	name = nil
	coords = nil
	data = []
	kmlData.lines.each do | line |
		if line =~ /<name>/
			name = line.match(/<name>(.+)<\/name>/)[1]
		elsif line =~ /<coordinates>/
			coords = line.match(/<coordinates>(.+)<\/coordinates>/)[1]
			coords = coords.split(' ')
			coords = coords.map { |c| c.split(',')[0..1] }
			coords = coords.map { |c| c.map { |p| p.to_f } }
		end
		if name != nil and coords != nil
			data << { 'name' => name, 'coordinates' => coords }
			name = nil
			coords = nil
		end
	end
	File.open('polygons.json','w') do |f|
		f << JSON.pretty_generate(data)
	end
end
