require 'rubygems'
require 'net/http'
require 'daemons'

class CreateParties
	def main
		Daemons.daemonize
		parties = [[41.551723485333135,-72.65949726104736], [41.556428309355084,-72.65464782714844],[41.55181983328688,-72.65814542770386],[41.55392339448171,-72.66058087348938],[41.555577291471984,-72.65838146209717]]
		while true
			begin
			30.times do
				curr = rand(parties.length)
				Net::HTTP.get('wespartymap.com', "/checkin/1/#{parties[curr][0]}/#{parties[curr][1]}")
			end
			puts "Sent 30 requests!"
			sleep 5*60
			rescue => e
			end
		end
	end
end

begin 
	mainObject = CreateParties.new
	mainObject.main()
end
